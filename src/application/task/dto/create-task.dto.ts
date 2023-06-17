import { IsNotEmpty, IsObject, IsUUID } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsUUID()
  licenseId: string;

  @IsNotEmpty()
  @IsUUID()
  robotId: string;

  @IsNotEmpty()
  @IsObject()
  parameters: Record<string, any>;
}
