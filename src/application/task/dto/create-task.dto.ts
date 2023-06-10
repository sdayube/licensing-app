import { IsNotEmpty, IsObject, IsUUID, ValidateNested } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsUUID()
  licenseId: string;

  @IsNotEmpty()
  @IsUUID()
  robotId: string;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  parameters: Record<string, any>;
}
