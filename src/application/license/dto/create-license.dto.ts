import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsEnum,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class CreateLicenseDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  expirationDate: string;

  @IsNotEmpty()
  @IsEnum(['active', 'suspended', 'canceled'])
  status: string;

  @IsNotEmpty()
  @IsUUID()
  clientId: string;

  @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  robotTypeId?: string;
}
