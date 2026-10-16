import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { RequirePermission } from '../auth/permissions.decorator.js';
import {
  JwtAuthGuard,
  type AuthenticatedRequest,
} from '../auth/jwt-auth.guard.js';
import { AdminUsersService } from './admin-users.service.js';

@Controller('users')
@RequirePermission('manage_users')
export class AdminUsersController {
  constructor(private adminUsersService: AdminUsersService) {}

  @Get()
  findAll() {
    return this.adminUsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminUsersService.findOne(id);
  }

  @Post()
  create(
    @Body()
    body: {
      fullName: string;
      staffNumber: string;
      email: string;
      roles: string[];
      department: string;
      temporaryPassword: string;
    },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.adminUsersService.create(body, req.user.sub);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    body: {
      fullName?: string;
      roles?: string[];      department?: string;
      status?: string;
      reason?: string;
    },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.adminUsersService.update(id, body, req.user.sub);
  }
}