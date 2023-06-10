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
import { GetListDto } from '@core/common/dto/get-list.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientService } from './client.service';
import { Client } from '@prisma/client';
import { OutputPayload } from '@core/common/interface/outputPayload.interface';

@ApiTags('Clients')
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  async findAll(@Query() query: GetListDto): Promise<OutputPayload<Client>> {
    const clients = await this.clientService.findAll(query);
    const count = await this.clientService.count(query.searchTerm);

    return {
      data: clients,
      pagination: {
        current: query.current,
        count,
      },
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Client> {
    return this.clientService.findById(id);
  }

  @Post()
  async create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.clientService.create(createClientDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    return this.clientService.update(id, updateClientDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Client> {
    return this.clientService.delete(id);
  }
}
