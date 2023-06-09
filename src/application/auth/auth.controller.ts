import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { isPublic } from './decorators/is-public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        identifier: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      },
    },
  })
  @isPublic()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: ExpressRequest & { user: User },
  ): Promise<{ accessToken: string }> {
    const { user } = req;
    const accessToken = await this.authService.generateToken(user);
    return { accessToken };
  }
}
