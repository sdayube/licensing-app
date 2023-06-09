import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { repositoryProviders } from '@core/domain/repositories';

@Module({
  controllers: [UserController],
  providers: [UserService, ...repositoryProviders],
})
export class UserModule {}
