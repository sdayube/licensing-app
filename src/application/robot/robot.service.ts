import { GetListDto } from '@core/common/dto/get-list.dto';
import { RobotRepository } from '@core/domain/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Robot } from '@prisma/client';
import { CreateRobotDto } from './dto/create-robot.dto';
import { UpdateRobotDto } from './dto/update-robot.dto';
import { checkUniqueness } from '@core/common/helpers/checkUniqueness';

@Injectable()
export class RobotService {
  constructor(private readonly robotRepository: RobotRepository) {}

  async findAll({ searchTerm, skip, take }: GetListDto): Promise<Robot[]> {
    return this.robotRepository.findMany(
      {
        title: { contains: searchTerm, mode: 'insensitive' },
      },
      { skip, take },
    );
  }

  async count(searchTerm: string): Promise<number> {
    return this.robotRepository.count({
      title: { contains: searchTerm, mode: 'insensitive' },
    });
  }

  async findById(id: string): Promise<Robot> {
    const robot = await this.robotRepository.findOne({ id });

    if (!robot) {
      throw new NotFoundException();
    }

    return robot;
  }

  async create(createRobotDto: CreateRobotDto): Promise<Robot> {
    const { title, url } = createRobotDto;
    await checkUniqueness({ title, url }, this.robotRepository);

    return this.robotRepository.create(createRobotDto);
  }

  async update(id: string, updateRobotDto: UpdateRobotDto): Promise<Robot> {
    const { title, url } = updateRobotDto;
    await checkUniqueness({ title, url }, this.robotRepository, {
      excludeId: id,
    });

    return this.robotRepository.update(id, updateRobotDto);
  }

  async delete(id: string): Promise<Robot> {
    return this.robotRepository.delete(id);
  }
}
