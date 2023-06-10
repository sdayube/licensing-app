import { PartialType } from '@nestjs/swagger';
import { CreateRobotTypeDto } from './create-robot-type.dto';

export class UpdateRobotTypeDto extends PartialType(CreateRobotTypeDto) {}
