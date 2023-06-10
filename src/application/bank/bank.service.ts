import { GetListDto } from '@core/common/dto/get-list.dto';
import { BankRepository } from '@core/domain/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Bank } from '@prisma/client';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

@Injectable()
export class BankService {
  constructor(private readonly licenseRepository: BankRepository) {}

  async findAll({ searchTerm, skip, take }: GetListDto): Promise<Bank[]> {
    return this.licenseRepository.findMany(
      {
        name: { contains: searchTerm, mode: 'insensitive' },
      },
      { skip, take },
    );
  }

  async count(searchTerm: string): Promise<number> {
    return this.licenseRepository.count({
      name: { contains: searchTerm, mode: 'insensitive' },
    });
  }

  async findById(id: string): Promise<Bank> {
    const license = await this.licenseRepository.findOne({ id });

    if (!license) {
      throw new NotFoundException();
    }

    return license;
  }

  async create(createBankDto: CreateBankDto): Promise<Bank> {
    return this.licenseRepository.create(createBankDto);
  }

  async update(id: string, updateBankDto: UpdateBankDto): Promise<Bank> {
    return this.licenseRepository.update(id, updateBankDto);
  }

  async delete(id: string): Promise<Bank> {
    return this.licenseRepository.delete(id);
  }
}
