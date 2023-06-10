import { GetListDto } from '@core/common/dto/get-list.dto';
import { RobotTypeRepository } from '@core/domain/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RobotType } from '@prisma/client';
import { CreateRobotTypeDto } from './dto/create-robot-type.dto';
import { UpdateRobotTypeDto } from './dto/update-robot-type.dto';

@Injectable()
export class RobotTypeService {
  constructor(private readonly robotTypeRepository: RobotTypeRepository) {}

  async findAll({ searchTerm, skip, take }: GetListDto): Promise<RobotType[]> {
    return this.robotTypeRepository.findMany(
      {
        title: { contains: searchTerm, mode: 'insensitive' },
      },
      { skip, take },
    );
  }

  async count(searchTerm: string): Promise<number> {
    return this.robotTypeRepository.count({
      title: { contains: searchTerm, mode: 'insensitive' },
    });
  }

  async findById(id: string): Promise<RobotType> {
    const license = await this.robotTypeRepository.findOne({ id });

    if (!license) {
      throw new NotFoundException();
    }

    return license;
  }

  async create(createRobotTypeDto: CreateRobotTypeDto): Promise<RobotType> {
    return this.robotTypeRepository.create(createRobotTypeDto);
  }

  async update(
    id: string,
    updateRobotTypeDto: UpdateRobotTypeDto,
  ): Promise<RobotType> {
    return this.robotTypeRepository.update(id, updateRobotTypeDto);
  }

  async delete(id: string): Promise<RobotType> {
    return this.robotTypeRepository.delete(id);
  }
}
