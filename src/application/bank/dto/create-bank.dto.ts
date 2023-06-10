import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBankDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNumber()
  febrabanCode: number;
}
