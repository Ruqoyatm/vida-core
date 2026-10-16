import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { type AuthenticatedRequest } from './jwt-auth.guard.js';
import { RequirePermission } from './permissions.decorator.js';
import type { Response } from 'express';
import { Public } from './public.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  register(
    @Body() body: { email: string; password: string; fullName: string },
  ) {
    return this.authService.register(body.email, body.password, body.fullName);
  }

  @Public()
  @Post('login')
  async login(
    @Body() body: { identifier: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(body.identifier, body.password);

    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    return { mustChangePassword: result.mustChangePassword };
  }

  @Public()
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return { ok: true };
  }

  @Get('me')
  me(@Req() req: AuthenticatedRequest) {
    return this.authService.getProfile(req.user.sub);
  }

  @RequirePermission('manage_users')
  @Get('admin-only')
  adminOnly() {
    return { message: 'Only an admin can see this' };
  }
}