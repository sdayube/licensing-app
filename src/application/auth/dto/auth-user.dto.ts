import { IsString } from 'class-validator';

export class authUserDto {
  /**
   * Identifier for internal authentication
   */
  @IsString()
  identifier: string;

  /**
   * Raw password for internal authentication. Use bcrypt to hash it.
   */
  @IsString()
  password: string;
}
