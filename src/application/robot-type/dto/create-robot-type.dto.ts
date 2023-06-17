import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRobotTypeDto {
  @ApiProperty({ example: 'Higienização' })
  @IsNotEmpty()
  @IsString()
  title: string;
}
