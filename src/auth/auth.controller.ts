import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard,  type AuthenticatedRequest } from './jwt-auth.guard.js';
import { RolesGuard } from './roles.guard.js';
import { Roles } from './roles.decorator.js';
import { UserRole } from '../users/user-role.enum.js';
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
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: AuthenticatedRequest) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Get('admin-only')
adminOnly() {
  return { message: 'Only an admin can see this' };
}
}