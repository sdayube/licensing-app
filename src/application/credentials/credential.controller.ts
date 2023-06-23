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
import { Credential } from '@prisma/client';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { CredentialService } from './credential.service';
import { GetListDto } from '@core/common/dto/get-list.dto';
import { OutputPayload } from '@core/common/interface/outputPayload.interface';

@ApiTags('Credentials')
@Controller('credentials')
export class CredentialController {
  constructor(private readonly credentialService: CredentialService) {}

  @Get()
  async findAll(
    @Query() query: GetListDto,
  ): Promise<OutputPayload<Credential>> {
    const credentials = await this.credentialService.findAll(query);
    const count = await this.credentialService.count(query.searchTerm);

    return {
      data: credentials,
      pagination: {
        current: query.current,
        count,
      },
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Credential> {
    return this.credentialService.findById(id);
  }

  @Post()
  async create(
    @Body() createCredentialDto: CreateCredentialDto,
  ): Promise<Credential> {
    return this.credentialService.create(createCredentialDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCredentialDto: UpdateCredentialDto,
  ): Promise<Credential> {
    return this.credentialService.update(id, updateCredentialDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Credential> {
    return this.credentialService.delete(id);
  }
}
