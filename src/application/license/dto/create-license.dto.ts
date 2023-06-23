import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import moment from 'moment';

export class CreateLicenseDto {
  @ApiProperty({ example: 'Licença 1' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: moment().add(1, 'month').toISOString() })
  @IsNotEmpty()
  @IsDateString({ strict: true })
  expirationDate: string;

  @ApiProperty({ example: 'active' })
  @IsNotEmpty()
  @IsIn(['active', 'suspended', 'canceled'])
  status: 'active' | 'suspended' | 'canceled';

  @ApiProperty({ example: 'clientId' })
  @IsNotEmpty()
  @IsUUID()
  clientId: string;

  @ApiProperty({ example: 'robotId' })
  @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  robotId?: string;
}
