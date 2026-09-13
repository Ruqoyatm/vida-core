import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard, AuthenticatedRequest } from './jwt-auth.guard.js';
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
}