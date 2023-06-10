import { PrismaModule } from '@core/infra/database/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ClientModule } from './client/client.module';
import { UserModule } from './user/user.module';
import { LicenseModule } from './license/license.module';
import { RobotModule } from './robot/robot.module';
import { RobotTypeModule } from './robot-type/robot-type.module';
import { BankModule } from './bank/bank.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    PrismaModule,
    AuthModule,
    ClientModule,
    UserModule,
    LicenseModule,
    RobotModule,
    RobotTypeModule,
    BankModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
