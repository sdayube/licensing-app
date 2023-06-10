import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { repositoryProviders } from '@core/domain/repositories';

@Module({
  controllers: [ClientController],
  providers: [ClientService, ...repositoryProviders],
})
export class ClientModule {}
