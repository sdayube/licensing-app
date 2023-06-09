import { User } from '@prisma/client';

export type OutputUserDto = Omit<User, 'password'>;
