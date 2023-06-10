import { ClientRepository } from '@core/domain/repositories';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Client } from '@prisma/client';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { GetListDto } from '@core/common/dto/get-list.dto';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async findAll({ searchTerm, skip, take }: GetListDto): Promise<Client[]> {
    return this.clientRepository.findMany(
      {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } },
          { cpf: { contains: searchTerm, mode: 'insensitive' } },
          { cnpj: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      { skip, take },
    );
  }

  async count(searchTerm: string): Promise<number> {
    return this.clientRepository.count({
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
        { cpf: { contains: searchTerm, mode: 'insensitive' } },
        { cnpj: { contains: searchTerm, mode: 'insensitive' } },
      ],
    });
  }

  async findById(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({ id });

    if (!client) {
      throw new NotFoundException();
    }

    return client;
  }

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const { name, email, cpf, cnpj } = createClientDto;

    const existingClient = await this.clientRepository.findOne({
      OR: [{ name }, { email }, { cpf }, { cnpj }],
    });

    if (existingClient) {
      const equalFields = ['name', 'email', 'cpf', 'cnpj'].filter(
        (field) => existingClient[field] === createClientDto[field],
      );

      const fieldsMessage = equalFields.join(' and ');

      throw new ConflictException(
        `Client with same ${fieldsMessage} already exists`,
      );
    }

    return this.clientRepository.create(createClientDto);
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const { name, email, cpf, cnpj } = updateClientDto;

    if (name || email || cpf || cnpj) {
      const existingClient = await this.clientRepository.findOne({
        OR: [{ name }, { email }, { cpf }, { cnpj }],
        NOT: { id },
      });

      if (existingClient) {
        const equalFields = ['name', 'email', 'cpf', 'cnpj'].filter(
          (field) => existingClient[field] === updateClientDto[field],
        );

        const fieldsMessage = equalFields.join(' and ');

        throw new ConflictException(
          `Client with same ${fieldsMessage} already exists`,
        );
      }
    }
    return this.clientRepository.update(id, updateClientDto);
  }

  async delete(id: string): Promise<Client> {
    return this.clientRepository.delete(id);
  }
}
