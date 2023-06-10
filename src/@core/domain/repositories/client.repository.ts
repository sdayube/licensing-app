import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/@core/infra/database/prisma.service';
import { Prisma, Client } from '@prisma/client';
import { CreateClientDto } from 'src/application/client/dto/create-client.dto';
import { UpdateClientDto } from 'src/application/client/dto/update-client.dto';

@Injectable()
export class ClientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    filter: Prisma.ClientWhereInput = {},
    pagination?: { skip?: number; take?: number },
  ): Promise<Client[]> {
    return this.prisma.client.findMany({
      where: {
        ...filter,
        deletedAt: null,
      },
      ...pagination,
    });
  }

  async count(filter: Prisma.ClientWhereInput = {}): Promise<number> {
    return this.prisma.client.count({
      where: {
        ...filter,
        deletedAt: null,
      },
    });
  }

  async findOne(filter: Prisma.ClientWhereInput = {}): Promise<Client | null> {
    return this.prisma.client.findFirst({
      where: {
        ...filter,
        deletedAt: null,
      },
    });
  }

  async create(data: CreateClientDto): Promise<Client> {
    return this.prisma.client.create({ data });
  }

  async update(id: string, data: UpdateClientDto): Promise<Client> {
    return this.prisma.client.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Client> {
    return this.prisma.client.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
