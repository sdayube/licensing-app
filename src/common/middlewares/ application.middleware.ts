import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ApplicationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    // do something with an incoming request
    next();
  }
}
