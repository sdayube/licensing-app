import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/@core/infra/database/prisma.service';
import { Prisma, License } from '@prisma/client';
import { CreateLicenseDto } from 'src/application/license/dto/create-license.dto';
import { UpdateLicenseDto } from 'src/application/license/dto/update-license.dto';

@Injectable()
export class LicenseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    filter: Prisma.LicenseWhereInput = {},
    pagination?: { skip?: number; take?: number },
  ): Promise<License[]> {
    return this.prisma.license.findMany({
      where: {
        ...filter,
        deletedAt: null,
      },
      ...pagination,
    });
  }

  async count(filter: Prisma.LicenseWhereInput = {}): Promise<number> {
    return this.prisma.license.count({
      where: {
        ...filter,
        deletedAt: null,
      },
    });
  }

  async findOne(
    filter: Prisma.LicenseWhereInput = {},
  ): Promise<License | null> {
    return this.prisma.license.findFirst({
      where: {
        ...filter,
        deletedAt: null,
      },
    });
  }

  async create(
    data: CreateLicenseDto & { licenseKey: string; hasQueue?: boolean },
  ): Promise<License> {
    return this.prisma.license.create({ data });
  }

  async update(
    id: string,
    data: UpdateLicenseDto & { hasQueue?: boolean },
  ): Promise<License> {
    return this.prisma.license.update({ where: { id }, data });
  }

  async delete(id: string): Promise<License> {
    return this.prisma.license.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
