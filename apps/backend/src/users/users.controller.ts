import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Req,
  Param,
  Body,
  UseGuards,
  BadRequestException,
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

  @Get('suggested')
  @UseGuards(JwtAuthGuard)
  getSuggested(@Req() req) {
    return this.usersService.getSuggestedUsers(req.user.userId);
  }

  @Get(':username')
  getByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Get(':userId/followers')
  getFollowers(@Param('userId') userId: string) {
    return this.usersService.getFollowers(userId);
  }

  @Get(':userId/following')
  getFollowing(@Param('userId') userId: string) {
    return this.usersService.getFollowing(userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @Req() req,
    @Body() data: {
      displayName?: string;
      bio?: string;
      avatarUrl?: string;
    },
  ) {
    return this.usersService.updateProfile(req.user.userId, data);
  }

  @Post(':userId/follow')
  @UseGuards(JwtAuthGuard)
  follow(@Req() req, @Param('userId') targetUserId: string) {
    if (req.user.userId === targetUserId) {
      throw new BadRequestException('Cannot follow yourself');
    }
    return this.usersService.toggleFollow(req.user.userId, targetUserId);
  }

  @Delete(':userId/follow')
  @UseGuards(JwtAuthGuard)
  unfollow(@Req() req, @Param('userId') targetUserId: string) {
    return this.usersService.toggleFollow(req.user.userId, targetUserId);
  }
}