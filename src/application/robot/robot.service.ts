import { GetListDto } from '@core/common/dto/get-list.dto';
import { RobotRepository } from '@core/domain/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Robot } from '@prisma/client';
import { CreateRobotDto } from './dto/create-robot.dto';
import { UpdateRobotDto } from './dto/update-robot.dto';

@Injectable()
export class RobotService {
  constructor(private readonly licenseRepository: RobotRepository) {}

  async findAll({ searchTerm, skip, take }: GetListDto): Promise<Robot[]> {
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

  async findById(id: string): Promise<Robot> {
    const license = await this.licenseRepository.findOne({ id });

    if (!license) {
      throw new NotFoundException();
    }

    return license;
  }

  async create(createRobotDto: CreateRobotDto): Promise<Robot> {
    return this.licenseRepository.create(createRobotDto);
  }

  async update(id: string, updateRobotDto: UpdateRobotDto): Promise<Robot> {
    return this.licenseRepository.update(id, updateRobotDto);
  }

  async delete(id: string): Promise<Robot> {
    return this.licenseRepository.delete(id);
  }
}
