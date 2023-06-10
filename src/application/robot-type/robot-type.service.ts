import { GetListDto } from '@core/common/dto/get-list.dto';
import { RobotTypeRepository } from '@core/domain/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RobotType } from '@prisma/client';
import { CreateRobotTypeDto } from './dto/create-robot-type.dto';
import { UpdateRobotTypeDto } from './dto/update-robot-type.dto';

@Injectable()
export class RobotTypeService {
  constructor(private readonly licenseRepository: RobotTypeRepository) {}

  async findAll({ searchTerm, skip, take }: GetListDto): Promise<RobotType[]> {
    return this.licenseRepository.findMany(
      {
        title: { contains: searchTerm, mode: 'insensitive' },
      },
      { skip, take },
    );
  }

  async count(searchTerm: string): Promise<number> {
    return this.licenseRepository.count({
      title: { contains: searchTerm, mode: 'insensitive' },
    });
  }

  async findById(id: string): Promise<RobotType> {
    const license = await this.licenseRepository.findOne({ id });

    if (!license) {
      throw new NotFoundException();
    }

    return license;
  }

  async create(createRobotTypeDto: CreateRobotTypeDto): Promise<RobotType> {
    return this.licenseRepository.create(createRobotTypeDto);
  }

  async update(
    id: string,
    updateRobotTypeDto: UpdateRobotTypeDto,
  ): Promise<RobotType> {
    return this.licenseRepository.update(id, updateRobotTypeDto);
  }

  async delete(id: string): Promise<RobotType> {
    return this.licenseRepository.delete(id);
  }
}
