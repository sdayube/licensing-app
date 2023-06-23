import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './application/app.module';
import { AuthModule } from './application/auth/auth.module';
import { UserModule } from './application/user/user.module';
import { PrismaExceptionFilter } from './common/errors/PrismaExceptionFilter';
import { ClientModule } from './application/client/client.module';
import { LicenseModule } from './application/license/license.module';
import { RobotModule } from './application/robot/robot.module';
import { RobotTypeModule } from './application/robot-type/robot-type.module';
import { BankModule } from './application/bank/bank.module';
import { TaskModule } from './application/task/task.module';
import { CredentialModule } from './application/credentials/credential.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new PrismaExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Techmatize API')
    .setDescription('API for managing robots and licenses')
    .setVersion('0.0.1')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();

  const options: SwaggerDocumentOptions = {
    include: [
      AuthModule,
      ClientModule,
      UserModule,
      LicenseModule,
      CredentialModule,
      RobotModule,
      RobotTypeModule,
      BankModule,
      TaskModule,
    ],
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
