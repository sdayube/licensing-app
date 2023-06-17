import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateBankDto {
  @ApiProperty({ example: 'Banco do Brasil' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '40040001' })
  @IsNotEmpty()
  @IsPhoneNumber('BR')
  phone: string;

  @ApiProperty({ example: 'contato@bb.com.br' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 1 })
  @Min(1)
  @Max(999)
  febrabanCode: number;
}
