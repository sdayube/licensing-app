import { IsIn, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';

export class UpdateTaskDto {
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  result?: Record<string, any>;

  @IsNotEmpty()
  @IsIn(['processing', 'finished', 'failed'])
  status: 'processing' | 'finished' | 'failed';
}
