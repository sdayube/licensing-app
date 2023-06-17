import { GetListDto } from '@core/common/dto/get-list.dto';
import { RobotTypeRepository } from '@core/domain/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RobotType } from '@prisma/client';
import { CreateRobotTypeDto } from './dto/create-robot-type.dto';
import { UpdateRobotTypeDto } from './dto/update-robot-type.dto';
import { checkUniqueness } from '@core/common/helpers/checkUniqueness';

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
    const robotType = await this.robotTypeRepository.findOne({ id });

    if (!robotType) {
      throw new NotFoundException();
    }

    return robotType;
  }

  async create(createRobotTypeDto: CreateRobotTypeDto): Promise<RobotType> {
    const { title } = createRobotTypeDto;
    await checkUniqueness({ title }, this.robotTypeRepository);

    return this.robotTypeRepository.create(createRobotTypeDto);
  }

  async update(
    id: string,
    updateRobotTypeDto: UpdateRobotTypeDto,
  ): Promise<RobotType> {
    const { title } = updateRobotTypeDto;
    await checkUniqueness({ title }, this.robotTypeRepository, {
      excludeId: id,
    });

    return this.robotTypeRepository.update(id, updateRobotTypeDto);
  }

  async delete(id: string): Promise<RobotType> {
    return this.robotTypeRepository.delete(id);
  }
}
