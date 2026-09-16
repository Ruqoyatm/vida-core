import { Body, Controller, Get, Post, Req, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard,  type AuthenticatedRequest } from './jwt-auth.guard.js';
import { RolesGuard } from './roles.guard.js';
import { Roles } from './roles.decorator.js';
import { UserRole } from '../users/user-role.enum.js';
import type { Response } from 'express'
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
register(
  @Body() body: { email: string; password: string; fullName: string },
) {
  return this.authService.register(body.email, body.password, body.fullName);
}
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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: AuthenticatedRequest) {
    return this .authService.getProfile(req.user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Get('admin-only')
adminOnly() {
  return { message: 'Only an admin can see this' };
}
}