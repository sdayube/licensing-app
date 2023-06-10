import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/@core/infra/database/prisma.service';
import { Prisma, RobotType } from '@prisma/client';
import { CreateRobotTypeDto } from 'src/application/robot-type/dto/create-robot-type.dto';
import { UpdateRobotTypeDto } from 'src/application/robot-type/dto/update-robot-type.dto';

@Injectable()
export class RobotTypeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    filter: Prisma.RobotTypeWhereInput = {},
    pagination?: { skip?: number; take?: number },
  ): Promise<RobotType[]> {
    return this.prisma.robotType.findMany({
      where: {
        ...filter,
        deletedAt: null,
      },
      ...pagination,
    });
  }

  async count(filter: Prisma.RobotTypeWhereInput = {}): Promise<number> {
    return this.prisma.robotType.count({
      where: {
        ...filter,
        deletedAt: null,
      },
    });
  }

  async findOne(
    filter: Prisma.RobotTypeWhereInput = {},
  ): Promise<RobotType | null> {
    return this.prisma.robotType.findFirst({
      where: {
        ...filter,
        deletedAt: null,
      },
    });
  }

  async create(data: CreateRobotTypeDto): Promise<RobotType> {
    return this.prisma.robotType.create({ data });
  }

  async update(id: string, data: UpdateRobotTypeDto): Promise<RobotType> {
    return this.prisma.robotType.update({ where: { id }, data });
  }

  async delete(id: string): Promise<RobotType> {
    return this.prisma.robotType.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
