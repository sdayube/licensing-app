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
import { RobotType } from '@prisma/client';
import { CreateRobotTypeDto } from './dto/create-robot-type.dto';
import { UpdateRobotTypeDto } from './dto/update-robot-type.dto';
import { RobotTypeService } from './robot-type.service';
import { GetListDto } from '@core/common/dto/get-list.dto';
import { OutputPayload } from '@core/common/interface/outputPayload.interface';

@ApiTags('Robot Types')
@Controller('robot-types')
export class RobotTypeController {
  constructor(private readonly robotTypeService: RobotTypeService) {}

  @Get()
  async findAll(@Query() query: GetListDto): Promise<OutputPayload<RobotType>> {
    const robotTypes = await this.robotTypeService.findAll(query);
    const count = await this.robotTypeService.count(query.searchTerm);

    return {
      data: robotTypes,
      pagination: {
        current: query.current,
        count,
      },
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<RobotType> {
    return this.robotTypeService.findById(id);
  }

  @Post()
  async create(
    @Body() createRobotTypeDto: CreateRobotTypeDto,
  ): Promise<RobotType> {
    return this.robotTypeService.create(createRobotTypeDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRobotTypeDto: UpdateRobotTypeDto,
  ): Promise<RobotType> {
    return this.robotTypeService.update(id, updateRobotTypeDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<RobotType> {
    return this.robotTypeService.delete(id);
  }
}
