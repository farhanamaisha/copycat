import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        followers: true,
        following: true,
        clowderMembers: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName || user.username,
      email: user.email,
      avatarUrl: user.avatarUrl || null,
      bio: user.bio || null,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      clowdersCount: user.clowderMembers.length,
      createdAt: user.createdAt,
      isVerified: user.isVerified,
      isPremium: user.isPremium,
    };
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        followers: true,
        following: true,
        clowderMembers: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User @${username} not found`);
    }

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName || user.username,
      email: user.email,
      avatarUrl: user.avatarUrl || null,
      bio: user.bio || null,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      clowdersCount: user.clowderMembers.length,
      createdAt: user.createdAt,
      isVerified: user.isVerified,
      isPremium: user.isPremium,
    };
  }

  async updateProfile(
    userId: string,
    data: {
      displayName?: string;
      bio?: string;
      avatarUrl?: string;
    },
  ) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        displayName: data.displayName,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
      },
      include: {
        followers: true,
        following: true,
        clowderMembers: true,
      },
    });

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName || user.username,
      email: user.email,
      avatarUrl: user.avatarUrl || null,
      bio: user.bio || null,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      clowdersCount: user.clowderMembers.length,
      createdAt: user.createdAt,
      isVerified: user.isVerified,
      isPremium: user.isPremium,
    };
  }

  async getSuggestedUsers(userId: string, limit = 5) {
    const users = await this.prisma.user.findMany({
      where: {
        id: { not: userId },
        following: {
          none: { followerId: userId },
        },
      },
      include: {
        followers: true,
        following: true,
        clowderMembers: true,
      },
      take: limit,
    });

    return users.map((user) => ({
      id: user.id,
      username: user.username,
      displayName: user.displayName || user.username,
      email: user.email,
      avatarUrl: user.avatarUrl || null,
      bio: user.bio || null,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      clowdersCount: user.clowderMembers.length,
      createdAt: user.createdAt,
      isVerified: user.isVerified,
      isPremium: user.isPremium,
    }));
  }

  async getFollowers(userId: string) {
    const follows = await this.prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          include: {
            followers: true,
            following: true,
            clowderMembers: true,
          },
        },
      },
    });

    return follows.map((follow) => {
      const user = follow.follower;
      return {
        id: user.id,
        username: user.username,
        displayName: user.displayName || user.username,
        email: user.email,
        avatarUrl: user.avatarUrl || null,
        bio: user.bio || null,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        clowdersCount: user.clowderMembers.length,
        createdAt: user.createdAt,
        isVerified: user.isVerified,
        isPremium: user.isPremium,
      };
    });
  }

  async getFollowing(userId: string) {
    const follows = await this.prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          include: {
            followers: true,
            following: true,
            clowderMembers: true,
          },
        },
      },
    });

    return follows.map((follow) => {
      const user = follow.following;
      return {
        id: user.id,
        username: user.username,
        displayName: user.displayName || user.username,
        email: user.email,
        avatarUrl: user.avatarUrl || null,
        bio: user.bio || null,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        clowdersCount: user.clowderMembers.length,
        createdAt: user.createdAt,
        isVerified: user.isVerified,
        isPremium: user.isPremium,
      };
    });
  }

  async toggleFollow(followerId: string, followingId: string) {
    const existingFollow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      await this.prisma.follow.delete({
        where: { id: existingFollow.id },
      });
      return { following: false };
    } else {
      await this.prisma.follow.create({
        data: {
          followerId,
          followingId,
        },
      });
      return { following: true };
    }
  }
}
