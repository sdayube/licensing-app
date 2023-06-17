import { LicenseRepository } from '@core/domain/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { License } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { CreateLicenseDto } from './dto/create-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';
import { GetListDto } from '@core/common/dto/get-list.dto';

@Injectable()
export class LicenseService {
  constructor(private readonly licenseRepository: LicenseRepository) {}

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
    return this.licenseRepository.create({ ...createLicenseDto, licenseKey });
  }

  async update(
    id: string,
    updateLicenseDto: UpdateLicenseDto,
  ): Promise<License> {
    return this.licenseRepository.update(id, updateLicenseDto);
  }

  async delete(id: string): Promise<License> {
    return this.licenseRepository.delete(id);
  }

  async validateLicenseKey(
    licenseKey: string,
  ): Promise<{ isValid: boolean; license: License }> {
    const license = await this.findByLicenseKey(licenseKey);

    const isValid =
      license.status === 'active' && license.expirationDate > new Date();

    return { isValid, license };
  }

  private generateLicenseKey(): string {
    return uuidv4();
  }
}
