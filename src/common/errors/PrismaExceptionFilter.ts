import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception.code === 'P2025') {
      const errorResponse = {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Entity not found in database.',
        error: 'Not Found',
      };
      response.status(HttpStatus.NOT_FOUND).json(errorResponse);
    } else if (exception.code === 'P2002') {
      const errorResponse = {
        statusCode: HttpStatus.CONFLICT,
        message: 'Unique constraint violation in database.',
        error: 'Conflict',
      };
      response.status(HttpStatus.CONFLICT).json(errorResponse);
    } else if (exception.code === 'P2003') {
      const errorResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid relation constraint in database.',
        error: 'Bad Request',
      };
      response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
    } else {
      throw exception;
    }
  }
}
