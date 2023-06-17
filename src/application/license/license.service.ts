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

  async create(createLicenseDto: CreateLicenseDto): Promise<License> {
    const hasQueue = this.validateLicense(createLicenseDto);

    const license = await this.licenseRepository.create({
      ...createLicenseDto,
      hasQueue,
    });

    if (hasQueue) {
      await this.rabbitMQService.createQueue(`license.${license.id}`);
    }

    return license;
  }

  async update(
    id: string,
    updateLicenseDto: UpdateLicenseDto,
  ): Promise<License> {
    let license = await this.licenseRepository.update(id, updateLicenseDto);
    const hasQueue = this.validateLicense(license);

    if (hasQueue && !license.hasQueue) {
      await this.rabbitMQService.createQueue(`license.${license.id}`);
      license = await this.licenseRepository.update(id, { hasQueue: true });
    }

    if (!hasQueue && license.hasQueue) {
      await this.rabbitMQService.deleteQueue(`license.${license.id}`);
      license = await this.licenseRepository.update(id, { hasQueue: false });
    }

    return license;
  }

  async delete(id: string): Promise<License> {
    let license = await this.licenseRepository.delete(id);

    if (license.hasQueue) {
      await this.rabbitMQService.deleteQueue(`license.${license.id}`);
      license = await this.licenseRepository.update(id, { hasQueue: false });
    }

    return license;
  }

  async validateLicenseById(
    id: string,
  ): Promise<{ isValid: boolean; license: License }> {
    const license = await this.licenseRepository.findOne({ id });

    if (!license) {
      throw new NotFoundException();
    }

    const isValid = this.validateLicense(license);

    return { isValid, license };
  }

  @Cron(process.env.LICENSE_EXPIRED_VERIFICATION_CRON)
  async deactivateExpiredLicenseQueues(): Promise<void> {
    console.log('Deactivating expired license queues...');
    const licenses = await this.licenseRepository.findMany({
      expirationDate: { lte: new Date() },
      hasQueue: true,
    });

    console.log(
      `Found ${licenses.length} expired licenses with active queues.`,
    );

    await Promise.all(
      licenses.map(({ id }) =>
        this.rabbitMQService
          .deleteQueue(`license.${id}`)
          .then(() => this.licenseRepository.update(id, { hasQueue: false }))
          .then(() => console.log(`Queue license.${id} deactivated.`)),
      ),
    );

    licenses.length && console.log('All expired license queues deactivated.');
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
