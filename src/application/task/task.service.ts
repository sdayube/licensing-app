import { GetListDto } from '@core/common/dto/get-list.dto';
import { TaskRepository } from '@core/domain/repositories';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Task } from '@prisma/client';
import { LicenseService } from '../license/license.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { RabbitMQService } from 'src/common/connections/rabbitmq/rabbitmq.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly licenseService: LicenseService,
    private readonly rabbitMQService: RabbitMQService,
  ) {
    this.consumeRobotResponses();
  }

  async findAll({
    skip,
    take,
  }: Omit<GetListDto, 'searchTerm'>): Promise<Task[]> {
    return this.taskRepository.findMany({}, { skip, take });
  }

  async count(): Promise<number> {
    return this.taskRepository.count();
  }

  async findById(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ id });

    if (!task) {
      throw new NotFoundException();
    }

    return task;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { isValid: isLicenseValid, license } =
      await this.licenseService.validateLicenseById(createTaskDto.licenseId);

    if (!isLicenseValid) throw new BadRequestException('Invalid license');

    if (!license.hasQueue)
      throw new BadRequestException('License does not have an assigned queue');

    const task = await this.taskRepository.create(createTaskDto);

    this.rabbitMQService.publishMessage(
      `license.${license.id}`,
      JSON.stringify(task),
    );

    return this.taskRepository.update(task.id, {
      status: 'processing',
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.taskRepository.update(id, updateTaskDto);
  }

  async consumeRobotResponses() {
    await this.rabbitMQService.consumeMessages('robot.response', (message) => {
      console.log(`Received message ${message}`);
      const response = JSON.parse(message);
      this.update(response.id, {
        status: response.status,
        result: response.result,
      });
    });
  }
}
