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
import { Bank } from '@prisma/client';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { BankService } from './bank.service';
import { GetListDto } from '@core/common/dto/get-list.dto';
import { OutputPayload } from '@core/common/interface/outputPayload.interface';

@ApiTags('Banks')
@Controller('banks')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Get()
  async findAll(@Query() query: GetListDto): Promise<OutputPayload<Bank>> {
    const banks = await this.bankService.findAll(query);
    const count = await this.bankService.count(query.searchTerm);

    return {
      data: banks,
      pagination: {
        current: query.current,
        count,
      },
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Bank> {
    return this.bankService.findById(id);
  }

  @Post()
  async create(@Body() createBankDto: CreateBankDto): Promise<Bank> {
    return this.bankService.create(createBankDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBankDto: UpdateBankDto,
  ): Promise<Bank> {
    return this.bankService.update(id, updateBankDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Bank> {
    return this.bankService.delete(id);
  }
}
