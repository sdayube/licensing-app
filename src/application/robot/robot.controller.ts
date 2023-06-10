import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Robot } from '@prisma/client';
import { CreateRobotDto } from './dto/create-robot.dto';
import { UpdateRobotDto } from './dto/update-robot.dto';
import { RobotService } from './robot.service';
import { GetListDto } from '@core/common/dto/get-list.dto';
import { OutputPayload } from '@core/common/interface/outputPayload.interface';

@ApiTags('Robots')
@Controller('robots')
export class RobotController {
  constructor(private readonly robotService: RobotService) {}

  @Get()
  async findAll(@Query() query: GetListDto): Promise<OutputPayload<Robot>> {
    const robots = await this.robotService.findAll(query);
    const count = await this.robotService.count(query.searchTerm);

    return {
      data: robots,
      pagination: {
        current: query.current,
        count,
      },
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Robot> {
    return this.robotService.findById(id);
  }

  @Post()
  async create(@Body() createRobotDto: CreateRobotDto): Promise<Robot> {
    return this.robotService.create(createRobotDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRobotDto: UpdateRobotDto,
  ): Promise<Robot> {
    return this.robotService.update(id, updateRobotDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Robot> {
    return this.robotService.delete(id);
  }
}
