import { Module } from '@nestjs/common';
import { LicenseController } from './license.controller';
import { LicenseService } from './license.service';
import { repositoryProviders } from '@core/domain/repositories';

@Module({
  controllers: [LicenseController],
  providers: [LicenseService, ...repositoryProviders],
})
export class LicenseModule {}
