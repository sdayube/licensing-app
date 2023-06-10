import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/@core/infra/database/prisma.service';
import { Prisma, Robot } from '@prisma/client';
import { CreateRobotDto } from 'src/application/robot/dto/create-robot.dto';
import { UpdateRobotDto } from 'src/application/robot/dto/update-robot.dto';

@Injectable()
export class RobotRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    filter: Prisma.RobotWhereInput = {},
    pagination?: { skip?: number; take?: number },
  ): Promise<Robot[]> {
    return this.prisma.robot.findMany({
      where: {
        ...filter,
        deletedAt: null,
      },
      ...pagination,
    });
  }

  async count(filter: Prisma.RobotWhereInput = {}): Promise<number> {
    return this.prisma.robot.count({
      where: {
        ...filter,
        deletedAt: null,
      },
    });
  }

  async findOne(filter: Prisma.RobotWhereInput = {}): Promise<Robot | null> {
    return this.prisma.robot.findFirst({
      where: {
        ...filter,
        deletedAt: null,
      },
    });
  }

  async create(data: CreateRobotDto): Promise<Robot> {
    return this.prisma.robot.create({ data });
  }

  async update(id: string, data: UpdateRobotDto): Promise<Robot> {
    return this.prisma.robot.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Robot> {
    return this.prisma.robot.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
