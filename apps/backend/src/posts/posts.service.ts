import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(userId: string, data: { content: string; tags?: string[] }) {
    if (!data.content || data.content.trim().length === 0) {
      throw new BadRequestException('Post content cannot be empty');
    }

    const post = await this.prisma.post.create({
      data: {
        authorId: userId,
        content: data.content,
        tags: data.tags || [],
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        likes: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    return this.formatPost(post, userId);
  }

  async getPost(postId: string, userId?: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        likes: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.formatPost(post, userId);
  }

  async getFeed(userId: string, limit = 20, offset = 0) {
    const posts = await this.prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        likes: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return posts.map((post) => this.formatPost(post, userId));
  }

  async getUserPosts(targetUserId: string, userId?: string, limit = 20) {
    const posts = await this.prisma.post.findMany({
      where: { authorId: targetUserId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        likes: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return posts.map((post) => this.formatPost(post, userId));
  }

  async toggleLike(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: { likes: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = post.likes.find((like) => like.userId === userId);

    if (existingLike) {
      await this.prisma.reaction.delete({
        where: { id: existingLike.id },
      });

      return { liked: false };
    } else {
      await this.prisma.reaction.create({
        data: {
          userId,
          postId,
          type: 'like',
        },
      });

      return { liked: true };
    }
  }

  async deletePost(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new BadRequestException("Cannot delete another user's post");
    }

    await this.prisma.post.delete({
      where: { id: postId },
    });

    return { success: true };
  }

  private formatPost(post: any, userId?: string) {
    const isLiked = post.likes.some((like: any) => like.userId === userId);

    return {
      id: post.id,
      author: post.author,
      content: post.content,
      tags: post.tags || [],
      likesCount: post.likes.length,
      isLiked,
      isBookmarked: false,
      isReposted: false,
      repostsCount: 0,
      commentsCount: post.comments.length,
      comments: post.comments || [],
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
