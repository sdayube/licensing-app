import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateRobotTypeDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsDateString()
  bankId: string;
}
