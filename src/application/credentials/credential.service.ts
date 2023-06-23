import { GetListDto } from '@core/common/dto/get-list.dto';
import { CredentialRepository } from '@core/domain/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Credential } from '@prisma/client';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { checkUniqueness } from '@core/common/helpers/checkUniqueness';

@Injectable()
export class CredentialService {
  constructor(private readonly credentialRepository: CredentialRepository) {}

  async findAll({ searchTerm, skip, take }: GetListDto): Promise<Credential[]> {
    return this.credentialRepository.findMany(
      {
        username: { contains: searchTerm, mode: 'insensitive' },
      },
      { skip, take },
    );
  }

  async count(searchTerm: string): Promise<number> {
    return this.credentialRepository.count({
      username: { contains: searchTerm, mode: 'insensitive' },
    });
  }

  async findById(id: string): Promise<Credential> {
    const credential = await this.credentialRepository.findOne({ id });

    if (!credential) {
      throw new NotFoundException();
    }

    return credential;
  }

  async create(createCredentialDto: CreateCredentialDto): Promise<Credential> {
    const { username } = createCredentialDto;
    await checkUniqueness({ username }, this.credentialRepository);

    return this.credentialRepository.create(createCredentialDto);
  }

  async update(
    id: string,
    updateCredentialDto: UpdateCredentialDto,
  ): Promise<Credential> {
    const { username } = updateCredentialDto;
    await checkUniqueness({ username }, this.credentialRepository, {
      excludeId: id,
    });

    return this.credentialRepository.update(id, updateCredentialDto);
  }

  async delete(id: string): Promise<Credential> {
    return this.credentialRepository.delete(id);
  }
}
