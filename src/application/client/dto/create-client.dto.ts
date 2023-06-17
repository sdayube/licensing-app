import { IsCNPJ, IsCPF } from '@core/common/validators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { cnpj, cpf } from 'cpf-cnpj-validator';

export class CreateClientDto {
  @ApiProperty({ example: 'Empresa Teste LTDA' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'empresa@teste.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '11999999999' })
  @IsPhoneNumber('BR')
  phone: string;

  @ApiPropertyOptional({ example: cpf.generate() })
  @IsOptional()
  @IsCPF()
  cpf?: string;

  @ApiPropertyOptional({ example: cnpj.generate() })
  @IsOptional()
  @IsCNPJ()
  cnpj?: string;
}
