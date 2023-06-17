import { GetListDto } from '@core/common/dto/get-list.dto';
import { OutputPayload } from '@core/common/interface/outputPayload.interface';
import {
  Body,
  Controller,
  Get,
  Param,
  // Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Task } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
// import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';

@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async findAll(
    @Query() query: Omit<GetListDto, 'searchTerm'>,
  ): Promise<OutputPayload<Task>> {
    const tasks = await this.taskService.findAll(query);
    const count = await this.taskService.count();

    return {
      data: tasks,
      pagination: {
        current: query.current,
        count,
      },
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Task> {
    return this.taskService.findById(id);
  }

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.create(createTaskDto);
  }

  // @Patch(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateTaskDto: UpdateTaskDto,
  // ): Promise<Task> {
  //   return this.taskService.update(id, updateTaskDto);
  // }
}
