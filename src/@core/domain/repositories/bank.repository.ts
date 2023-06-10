import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/@core/infra/database/prisma.service';
import { Prisma, Bank } from '@prisma/client';
import { CreateBankDto } from 'src/application/bank/dto/create-bank.dto';
import { UpdateBankDto } from 'src/application/bank/dto/update-bank.dto';

@Injectable()
export class BankRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    filter: Prisma.BankWhereInput = {},
    pagination?: { skip?: number; take?: number },
  ): Promise<Bank[]> {
    return this.prisma.bank.findMany({
      where: {
        ...filter,
        deletedAt: null,
      },
      ...pagination,
    });
  }

  async count(filter: Prisma.BankWhereInput = {}): Promise<number> {
    return this.prisma.bank.count({
      where: {
        ...filter,
        deletedAt: null,
      },
    });
  }

  async findOne(filter: Prisma.BankWhereInput = {}): Promise<Bank | null> {
    return this.prisma.bank.findFirst({
      where: {
        ...filter,
        deletedAt: null,
      },
    });
  }

  async create(data: CreateBankDto): Promise<Bank> {
    return this.prisma.bank.create({ data });
  }

  async update(id: string, data: UpdateBankDto): Promise<Bank> {
    return this.prisma.bank.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Bank> {
    return this.prisma.bank.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
