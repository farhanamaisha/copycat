import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

  constructor(
    private usersService: UsersService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req) {
    return this.usersService.findById(
      req.user.userId,
    );
  }
}