import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { isPublic } from './decorators/is-public.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ security: [] })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        identifier: {
          type: 'string',
          default: 'admin',
        },
        password: {
          type: 'string',
          default: 'admin@admin',
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
