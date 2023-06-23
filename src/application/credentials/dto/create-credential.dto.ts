import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCredentialDto {
  @ApiProperty({ example: 'robo001' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsUUID()
  bankId: string;

  @ApiProperty({ example: 'licenseId' })
  @IsUUID()
  licenseId: string;
}
