import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateRobotDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsEnum(['active', 'suspended'])
  status: string;

  @IsNotEmpty()
  @IsDateString()
  bankId: string;

  @IsNotEmpty()
  @IsString()
  type: string;
}
