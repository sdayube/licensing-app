import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsObject,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator';

export class CreateRobotDto {
  @ApiProperty({ example: 'Robô 1' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'robotTypeId' })
  @IsUUID()
  typeId: string;

  @IsNotEmpty()
  @IsUUID()
  bankId: string;

  @ApiProperty({ example: 'active' })
  @IsNotEmpty()
  @IsIn(['active', 'suspended'])
  status: string;

  @ApiProperty({ example: 'https://www.example.com/' })
  @IsUrl()
  url: string;

  @ApiProperty({ example: 'robo001' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: { param1: 'value1' } })
  @IsObject()
  params: Record<string, any>;
}
