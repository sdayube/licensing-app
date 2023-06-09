import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/@core/infra/database/prisma.service';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from 'src/application/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/application/user/dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(filter: Prisma.UserWhereInput = {}): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        ...filter,
        deletedAt: null,
      },
    });
  }

  async findOne(filter: Prisma.UserWhereInput = {}): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        ...filter,
        deletedAt: null,
      },
    });
  }

  async create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
