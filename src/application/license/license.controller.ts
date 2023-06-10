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
import { License } from '@prisma/client';
import { CreateLicenseDto } from './dto/create-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';
import { LicenseService } from './license.service';
import { GetListDto } from '@core/common/dto/get-list.dto';
import { OutputPayload } from '@core/common/interface/outputPayload.interface';

@ApiTags('Licenses')
@Controller('licenses')
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  @Get()
  async findAll(@Query() query: GetListDto): Promise<OutputPayload<License>> {
    const licenses = await this.licenseService.findAll(query);
    const count = await this.licenseService.count(query.searchTerm);

    return {
      data: licenses,
      pagination: {
        current: query.current,
        count,
      },
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<License> {
    return this.licenseService.findById(id);
  }

  @Post()
  async create(@Body() createLicenseDto: CreateLicenseDto): Promise<License> {
    return this.licenseService.create(createLicenseDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLicenseDto: UpdateLicenseDto,
  ): Promise<License> {
    return this.licenseService.update(id, updateLicenseDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<License> {
    return this.licenseService.delete(id);
  }
}
