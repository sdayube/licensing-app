import { Module } from '@nestjs/common';
import { BankController } from './bank.controller';
import { BankService } from './bank.service';
import { repositoryProviders } from '@core/domain/repositories';

@Module({
  controllers: [BankController],
  providers: [BankService, ...repositoryProviders],
})
export class BankModule {}
