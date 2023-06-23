import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/@core/infra/database/prisma.service';
import { Prisma, Credential } from '@prisma/client';
import { CreateCredentialDto } from 'src/application/credentials/dto/create-credential.dto';
import { UpdateCredentialDto } from 'src/application/credentials/dto/update-credential.dto';

@Injectable()
export class CredentialRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    filter: Prisma.CredentialWhereInput = {},
    pagination?: { skip?: number; take?: number },
  ): Promise<Credential[]> {
    return this.prisma.credential.findMany({
      where: {
        ...filter,
        deletedAt: null,
      },
      ...pagination,
    });
  }

  async count(filter: Prisma.CredentialWhereInput = {}): Promise<number> {
    return this.prisma.credential.count({
      where: {
        ...filter,
        deletedAt: null,
      },
    });
  }

  async findOne(
    filter: Prisma.CredentialWhereInput = {},
  ): Promise<Credential | null> {
    return this.prisma.credential.findFirst({
      where: {
        ...filter,
        deletedAt: null,
      },
    });
  }

  async create(data: CreateCredentialDto): Promise<Credential> {
    return this.prisma.credential.create({ data });
  }

  async update(id: string, data: UpdateCredentialDto): Promise<Credential> {
    return this.prisma.credential.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Credential> {
    return this.prisma.credential.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
