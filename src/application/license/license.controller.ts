import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { License } from '@prisma/client';
import { CreateLicenseDto } from './dto/create-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';
import { LicenseService } from './license.service';

@ApiTags('Licenses')
@Controller('licenses')
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  @Get()
  async findAll(): Promise<License[]> {
    return this.licenseService.findAll();
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
