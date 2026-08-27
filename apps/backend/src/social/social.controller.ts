// apps/backend/src/social/social.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Query,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SocialService } from './social.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RespondConnectionDto } from './dto/social.dto';

@Controller('social')
@UseGuards(JwtAuthGuard)
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  // ─── Search ───────────────────────────────────────────────────────────────

  @Get('search')
  async searchUsers(
    @Request() req: { user: { userId: string } },
    @Query('q') q: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const results = await this.socialService.searchUsers(
      req.user.userId,
      q ?? '',
      Number(page),
      Number(limit),
    );
    return { success: true, data: results };
  }

  // ─── Suggested Users ──────────────────────────────────────────────────────

  @Get('suggested')
  async getSuggestedUsers(@Request() req: { user: { userId: string } }) {
    const users = await this.socialService.getSuggestedUsers(req.user.userId);
    return { success: true, data: users };
  }

  // ─── Follow ───────────────────────────────────────────────────────────────

  @Post('follow/:userId')
  async followUser(
    @Request() req: { user: { userId: string } },
    @Param('userId') userId: string,
  ) {
    const result = await this.socialService.followUser(req.user.userId, userId);
    return { success: true, data: result };
  }

  @Delete('follow/:userId')
  async unfollowUser(
    @Request() req: { user: { userId: string } },
    @Param('userId') userId: string,
  ) {
    const result = await this.socialService.unfollowUser(req.user.userId, userId);
    return { success: true, data: result };
  }

  @Get('follow/status/:userId')
  async getFollowStatus(
    @Request() req: { user: { userId: string } },
    @Param('userId') userId: string,
  ) {
    const result = await this.socialService.getFollowStatus(req.user.userId, userId);
    return { success: true, data: result };
  }

  @Get('followers/:userId')
  async getFollowers(
    @Request() req: { user: { userId: string } },
    @Param('userId') userId: string,
  ) {
    const result = await this.socialService.getFollowers(userId, req.user.userId);
    return { success: true, data: result };
  }

  @Get('following/:userId')
  async getFollowing(
    @Request() req: { user: { userId: string } },
    @Param('userId') userId: string,
  ) {
    const result = await this.socialService.getFollowing(userId, req.user.userId);
    return { success: true, data: result };
  }

  // ─── Connections ──────────────────────────────────────────────────────────

  @Post('connections/send/:userId')
  async sendConnection(
    @Request() req: { user: { userId: string } },
    @Param('userId') userId: string,
  ) {
    const result = await this.socialService.sendConnection(req.user.userId, userId);
    return { success: true, data: result };
  }

  @Patch('connections/:id/respond')
  async respondToConnection(
    @Request() req: { user: { userId: string } },
    @Param('id') id: string,
    @Body() dto: RespondConnectionDto,
  ) {
    const result = await this.socialService.respondToConnection(
      req.user.userId,
      id,
      dto.status,
    );
    return { success: true, data: result };
  }

  @Get('connections')
  async getConnections(@Request() req: { user: {  userId: string } }) {
    const result = await this.socialService.getConnections(req.user.userId);
    return { success: true, data: result };
  }

  @Get('connections/pending')
  async getPendingRequests(@Request() req: { user: {  userId: string } }) {
    const result = await this.socialService.getPendingRequests(req.user.userId);
    return { success: true, data: result };
  }

  @Delete('connections/:id')
  async removeConnection(
    @Request() req: { user: { userId: string } },
    @Param('id') id: string,
  ) {
    const result = await this.socialService.removeConnection(req.user.userId, id);
    return { success: true, data: result };
  }
}