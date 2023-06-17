import { LicenseRepository } from '@core/domain/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { License } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { CreateLicenseDto } from './dto/create-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';
import { GetListDto } from '@core/common/dto/get-list.dto';
import { RabbitMQService } from 'src/common/connections/rabbitmq/rabbitmq.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class LicenseService {
  constructor(
    private readonly licenseRepository: LicenseRepository,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async findAll({ searchTerm, skip, take }: GetListDto): Promise<License[]> {
    return this.licenseRepository.findMany(
      {
        description: { contains: searchTerm, mode: 'insensitive' },
      },
      { skip, take },
    );
  }

  async count(searchTerm: string): Promise<number> {
    return this.licenseRepository.count({
      description: { contains: searchTerm, mode: 'insensitive' },
    });
  }

  async findById(id: string): Promise<License> {
    const license = await this.licenseRepository.findOne({ id });

    if (!license) {
      throw new NotFoundException();
    }

    return license;
  }

  async findByLicenseKey(licenseKey: string): Promise<License> {
    const license = await this.licenseRepository.findOne({ licenseKey });

    if (!license) {
      throw new NotFoundException();
    }

    return license;
  }

  async create(createLicenseDto: CreateLicenseDto): Promise<License> {
    const licenseKey = this.generateLicenseKey();
    const hasQueue = this.validateLicense(createLicenseDto);

    if (hasQueue) {
      await this.rabbitMQService.createQueue(`license.${licenseKey}`);
    }

    return this.licenseRepository.create({
      ...createLicenseDto,
      licenseKey,
      hasQueue,
    });
  }

  async update(
    id: string,
    updateLicenseDto: UpdateLicenseDto,
  ): Promise<License> {
    let license = await this.licenseRepository.update(id, updateLicenseDto);
    const hasQueue = this.validateLicense(license);

    if (hasQueue && !license.hasQueue) {
      await this.rabbitMQService.createQueue(`license.${license.licenseKey}`);
      license = await this.licenseRepository.update(id, { hasQueue: true });
    }

    if (!hasQueue && license.hasQueue) {
      await this.rabbitMQService.deleteQueue(`license.${license.licenseKey}`);
      license = await this.licenseRepository.update(id, { hasQueue: false });
    }

    return license;
  }

  async delete(id: string): Promise<License> {
    let license = await this.licenseRepository.delete(id);

    if (license.hasQueue) {
      await this.rabbitMQService.deleteQueue(`license.${license.licenseKey}`);
      license = await this.licenseRepository.update(id, { hasQueue: false });
    }

    return license;
  }

  async validateLicenseKey(
    licenseKey: string,
  ): Promise<{ isValid: boolean; license: License }> {
    const license = await this.findByLicenseKey(licenseKey);

    const isValid = this.validateLicense(license);

    return { isValid, license };
  }

  @Cron('*/10 * * * *')
  async deactivateInvalidLicenseQueues(): Promise<void> {
    console.log('Deactivating invalid license queues...');
    const licenses = await this.licenseRepository.findMany({
      OR: [
        { status: { not: 'active' }, hasQueue: true },
        { expirationDate: { lte: new Date() }, hasQueue: true },
      ],
    });

    console.log(
      `Found ${licenses.length} invalid licenses with active queues.`,
    );

    await Promise.all(
      licenses.map(({ id, licenseKey }) =>
        this.rabbitMQService
          .deleteQueue(`license.${licenseKey}`)
          .then(() => this.licenseRepository.update(id, { hasQueue: false }))
          .then(() => console.log(`Queue license.${licenseKey} deactivated.`)),
      ),
    );

    licenses.length && console.log('All invalid license queues deactivated.');
  }

  private generateLicenseKey(): string {
    return uuidv4();
  }

  private validateLicense(license: {
    status: string;
    expirationDate: Date | string;
  }): boolean {
    const expirationDate = new Date(license.expirationDate);
    return license.status === 'active' && expirationDate > new Date();
  }
}
