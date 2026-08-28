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
  createPost(
    @Req() req,
    @Body() body: { content: string; tags?: string[] },
  ) {
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

  @Get('user/:userId')
  getUserPosts(
    @Req() req,
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    return this.postsService.getUserPosts(
      userId,
      req.user?.userId,
      limit ? parseInt(limit) : 20,
    );
  }

  // GET COMMENTS
  @Get(':postId/comments')
  getComments(@Param('postId') postId: string) {
    return this.postsService.getComments(postId);
  }

  // CREATE COMMENT
  @Post(':postId/comments')
  @UseGuards(JwtAuthGuard)
  createComment(
    @Req() req,
    @Param('postId') postId: string,
    @Body() body: { content: string },
  ) {
    return this.postsService.createComment(
      postId,
      req.user.userId,
      body.content,
    );
  }

  // DELETE COMMENT
  @Delete('comments/:commentId')
  @UseGuards(JwtAuthGuard)
  deleteComment(
    @Req() req,
    @Param('commentId') commentId: string,
  ) {
    return this.postsService.deleteComment(
      commentId,
      req.user.userId,
    );
  }

  @Get(':postId')
  getPost(
    @Req() req,
    @Param('postId') postId: string,
  ) {
    return this.postsService.getPost(
      postId,
      req.user?.userId,
    );
  }

  @Post(':postId/like')
  @UseGuards(JwtAuthGuard)
  toggleLike(
    @Req() req,
    @Param('postId') postId: string,
  ) {
    return this.postsService.toggleLike(
      postId,
      req.user.userId,
    );
  }

  @Delete(':postId')
  @UseGuards(JwtAuthGuard)
  deletePost(
    @Req() req,
    @Param('postId') postId: string,
  ) {
    return this.postsService.deletePost(
      postId,
      req.user.userId,
    );
  }
}