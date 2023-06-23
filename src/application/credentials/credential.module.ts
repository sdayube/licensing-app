import { Module } from '@nestjs/common';
import { CredentialController } from './credential.controller';
import { CredentialService } from './credential.service';
import { repositoryProviders } from '@core/domain/repositories';

@Module({
  controllers: [CredentialController],
  providers: [CredentialService, ...repositoryProviders],
})
export class CredentialModule {}
