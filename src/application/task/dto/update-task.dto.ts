import { IsEnum, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';

export class UpdateTaskDto {
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  result: Record<string, any>;

  @IsNotEmpty()
  @IsEnum(['processing', 'finished', 'failed'])
  status: string;
}
