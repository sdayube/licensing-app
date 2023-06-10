import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/@core/infra/database/prisma.service';
import { Prisma, Task } from '@prisma/client';
import { CreateTaskDto } from 'src/application/task/dto/create-task.dto';
import { UpdateTaskDto } from 'src/application/task/dto/update-task.dto';

@Injectable()
export class TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    filter: Prisma.TaskWhereInput = {},
    pagination?: { skip?: number; take?: number },
  ): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: filter,
      ...pagination,
    });
  }

  async count(filter: Prisma.TaskWhereInput = {}): Promise<number> {
    return this.prisma.task.count({
      where: filter,
    });
  }

  async findOne(filter: Prisma.TaskWhereInput = {}): Promise<Task | null> {
    return this.prisma.task.findFirst({
      where: filter,
    });
  }

  async create(data: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({ data });
  }

  async update(id: string, data: UpdateTaskDto): Promise<Task> {
    return this.prisma.task.update({ where: { id }, data });
  }
}
