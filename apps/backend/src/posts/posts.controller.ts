import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createPost(@Req() req, @Body() body: { content: string; tags?: string[] }) {
    return this.postsService.createPost(req.user.userId, body);
  }

  @Get('feed')
  @UseGuards(JwtAuthGuard)
  getFeed(
    @Req() req,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.postsService.getFeed(
      req.user.userId,
      limit ? parseInt(limit) : 20,
      offset ? parseInt(offset) : 0,
    );
  }

  @Get(':postId')
  getPost(@Req() req, @Param('postId') postId: string) {
    const userId = req.user?.userId;
    return this.postsService.getPost(postId, userId);
  }

  @Post(':postId/like')
  @UseGuards(JwtAuthGuard)
  toggleLike(@Req() req, @Param('postId') postId: string) {
    return this.postsService.toggleLike(postId, req.user.userId);
  }

  @Delete(':postId')
  @UseGuards(JwtAuthGuard)
  deletePost(@Req() req, @Param('postId') postId: string) {
    return this.postsService.deletePost(postId, req.user.userId);
  }

  @Get('user/:userId')
  getUserPosts(
    @Req() req,
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    const currentUserId = req.user?.userId;
    return this.postsService.getUserPosts(
      userId,
      currentUserId,
      limit ? parseInt(limit) : 20,
    );
  }
}
