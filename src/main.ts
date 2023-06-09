import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger/dist';
import { AppModule } from './application/app.module';
import { AuthModule } from './application/auth/auth.module';
import { UserModule } from './application/user/user.module';
import { PrismaExceptionFilter } from './common/errors/PrismaExceptionFilter';

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
    .setTitle('NestJS API')
    .setDescription('NestJS API description')
    .setVersion('0.0.1')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();

  const options: SwaggerDocumentOptions = {
    include: [AuthModule, UserModule],
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
