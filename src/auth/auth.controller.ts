import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { type AuthenticatedRequest } from './jwt-auth.guard.js';
import { RequirePermission } from './permissions.decorator.js';
import type { Response } from 'express';
import { Public } from './public.decorator.js';

const COOKIE = {
  httpOnly: true,
  sameSite: (process.env.COOKIE_SAMESITE ?? 'lax') as 'lax' | 'none',
  secure: process.env.COOKIE_SECURE === 'true',
  path: '/',
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body() body: { identifier: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(body.identifier, body.password);

    res.cookie('access_token', result.access_token, {
      ...COOKIE,
      maxAge: 15 * 60 * 1000,
    });

    return { mustChangePassword: result.mustChangePassword };
  }

  @Public()
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', COOKIE);

    return { ok: true };
  }

    @Post('set-password')
  setPassword(
    @Req() req: AuthenticatedRequest,
    @Body() body: { password: string },
  ) {
    return this.authService.setPassword(req.user.sub, body.password);
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