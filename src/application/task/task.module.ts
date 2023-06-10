import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { repositoryProviders } from '@core/domain/repositories';

@Module({
  controllers: [TaskController],
  providers: [TaskService, ...repositoryProviders],
})
export class TaskModule {}
