import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { repositoryProviders } from '@core/domain/repositories';
import { LicenseService } from '../license/license.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, LicenseService, ...repositoryProviders],
})
export class TaskModule {}
