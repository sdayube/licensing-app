import { GetListDto } from '@core/common/dto/get-list.dto';
import { TaskRepository } from '@core/domain/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async findAll({
    skip,
    take,
  }: Omit<GetListDto, 'searchTerm'>): Promise<Task[]> {
    return this.taskRepository.findMany(null, { skip, take });
  }

  async count(): Promise<number> {
    return this.taskRepository.count();
  }

  async findById(id: string): Promise<Task> {
    const license = await this.taskRepository.findOne({ id });

    if (!license) {
      throw new NotFoundException();
    }

    return license;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.create(createTaskDto);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.taskRepository.update(id, updateTaskDto);
  }

  @Cron('*/1 * * * *')
  async processPendingTasks(): Promise<void> {
    console.log(`Processing pending tasks`);
    const tasks = await this.taskRepository.findMany({
      status: 'pending',
    });

    tasks.forEach((task) => {
      console.log(`Processing task ${task.id}:`);
      this.taskRepository.update(task.id, {
        status: 'finished',
        result: {
          message: 'Task finished successfully',
        },
      });
    });
  }
}
