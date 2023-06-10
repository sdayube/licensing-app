import { Module } from '@nestjs/common';
import { RobotTypeController } from './robot-type.controller';
import { RobotTypeService } from './robot-type.service';
import { repositoryProviders } from '@core/domain/repositories';

@Module({
  controllers: [RobotTypeController],
  providers: [RobotTypeService, ...repositoryProviders],
})
export class RobotTypeModule {}
