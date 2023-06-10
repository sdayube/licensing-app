import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetListDto {
  @ApiProperty({ default: '1' })
  @IsNumberString()
  @IsNotEmpty()
  page: string;

  @ApiProperty({ default: '25' })
  @IsNumberString()
  @IsNotEmpty()
  itemsPerPage: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  search?: string;

  get skip(): number {
    const num = Number(this.page);
    if (Number.isNaN(num) || num < 1) return 0;
    return num - 1;
  }

  get take(): number {
    const num = Number(this.itemsPerPage);
    if (Number.isNaN(num)) return 25;
    return num;
  }

  get current(): number {
    return this.skip + 1;
  }

  get searchTerm(): string {
    return this.search || '';
  }
}
