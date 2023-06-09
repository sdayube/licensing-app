import { UserRepository } from '@core/domain/repositories';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { OutputUserDto } from './dto/output-user.dto';
import { exclude } from '@core/utils/exclude';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<OutputUserDto[]> {
    return this.userRepository
      .findMany()
      .then((users) => users.map((user) => exclude(user, ['password'])));
  }

  async findById(id: string): Promise<OutputUserDto> {
    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new NotFoundException();
    }

    return exclude(user, ['password']);
  }

  async findByIdentifier(identifier: string): Promise<User> {
    return this.userRepository.findOne({
      OR: [
        { username: identifier },
        { email: identifier },
        { cpf: identifier },
      ],
    });
  }

  async create(createUserDto: CreateUserDto): Promise<OutputUserDto> {
    const { username, email, cpf } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      OR: [{ username }, { email }, { cpf }],
    });

    if (existingUser) {
      const equalFields = ['username', 'email', 'cpf'].filter(
        (field) => existingUser[field] === createUserDto[field],
      );

      const fieldsMessage = equalFields.join(' and ');

      throw new ConflictException(
        `User with same ${fieldsMessage} already exists`,
      );
    }

    createUserDto.password = await hash(
      createUserDto.password,
      parseInt(process.env.SECURITY_SALTS),
    );

    const user = await this.userRepository.create(createUserDto);

    return exclude(user, ['password']);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<OutputUserDto> {
    const { username, email, cpf } = updateUserDto;

    if (username || email || cpf) {
      const existingUser = await this.userRepository.findOne({
        OR: [{ username }, { email }, { cpf }],
        NOT: { id },
      });

      if (existingUser) {
        const equalFields = Object.keys(existingUser).filter(
          (field) => existingUser[field] === updateUserDto[field],
        );

        const fieldsMessage = equalFields.join(', ');

        throw new ConflictException(
          `User with same ${fieldsMessage} already exists`,
        );
      }
    }

    if (updateUserDto.password) {
      const hashedPassword = await hash(
        updateUserDto.password,
        parseInt(process.env.SECURITY_SALTS),
      );
      updateUserDto.password = hashedPassword;
    }

    const user = await this.userRepository.update(id, updateUserDto);

    return exclude(user, ['password']);
  }

  async delete(id: string): Promise<OutputUserDto> {
    const user = await this.userRepository.delete(id);

    return exclude(user, ['password']);
  }
}
