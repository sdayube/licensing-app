import { Module } from '@nestjs/common';
import { RobotController } from './robot.controller';
import { RobotService } from './robot.service';
import { repositoryProviders } from '@core/domain/repositories';

@Module({
  controllers: [RobotController],
  providers: [RobotService, ...repositoryProviders],
})
export class RobotModule {}
