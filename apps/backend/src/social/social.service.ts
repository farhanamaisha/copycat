// apps/backend/src/social/social.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SocialService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Search ───────────────────────────────────────────────────────────────

  async searchUsers(currentUserId: string, query: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const users = await this.prisma.user.findMany({
      where: {
        AND: [
          { id: { not: currentUserId } },
          {
            OR: [
              { username: { contains: query, mode: 'insensitive' } },
              { displayName: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        isVerified: true,
        isPremium: true,
        clone: { select: { name: true, level: true, mood: true } },
        _count: { select: { followers: true, following: true } },
        followers: {
          where: { followerId: currentUserId },
          select: { id: true },
        },
        sentConnections: {
          where: { receiverId: currentUserId },
          select: { id: true, status: true },
        },
        receivedConnections: {
          where: { senderId: currentUserId },
          select: { id: true, status: true },
        },
      },
      skip,
      take: limit,
      orderBy: { followers: { _count: 'desc' } },
    });

    return users.map((u) => ({
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      avatarUrl: u.avatarUrl,
      bio: u.bio,
      isVerified: u.isVerified,
      isPremium: u.isPremium,
      clone: u.clone,
      followersCount: u._count.followers,
      followingCount: u._count.following,
      isFollowedByMe: u.followers.length > 0,
      connectionStatus: this.resolveConnectionStatus(
        u.sentConnections,
        u.receivedConnections,
      ),
    }));
  }

  private resolveConnectionStatus(
    sent: { id: string; status: string }[],
    received: { id: string; status: string }[],
  ): { status: string; connectionId: string | null; isSender: boolean } {
    if (sent.length > 0) {
      return { status: sent[0].status, connectionId: sent[0].id, isSender: false };
    }
    if (received.length > 0) {
      return { status: received[0].status, connectionId: received[0].id, isSender: true };
    }
    return { status: 'NONE', connectionId: null, isSender: false };
  }

  // ─── Follow ───────────────────────────────────────────────────────────────

  async followUser(followerId: string, targetUserId: string) {
    if (followerId === targetUserId) {
      throw new BadRequestException('You cannot follow yourself.');
    }

    const target = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });
    if (!target) throw new NotFoundException('User not found.');

    const existing = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId, followingId: targetUserId },
      },
    });
    if (existing) throw new BadRequestException('Already following this user.');

    await this.prisma.follow.create({
      data: { followerId, followingId: targetUserId },
    });

    return { message: 'Successfully followed.', following: true };
  }

  async unfollowUser(followerId: string, targetUserId: string) {
    if (followerId === targetUserId) {
      throw new BadRequestException('You cannot unfollow yourself.');
    }

    const existing = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId, followingId: targetUserId },
      },
    });
    if (!existing) throw new BadRequestException('You are not following this user.');

    await this.prisma.follow.delete({
      where: {
        followerId_followingId: { followerId, followingId: targetUserId },
      },
    });

    return { message: 'Successfully unfollowed.', following: false };
  }

  async getFollowStatus(currentUserId: string, targetUserId: string) {
    const [isFollowing, isFollowedBy] = await Promise.all([
      this.prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: targetUserId,
          },
        },
      }),
      this.prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: targetUserId,
            followingId: currentUserId,
          },
        },
      }),
    ]);

    return {
      isFollowing: !!isFollowing,
      isFollowedBy: !!isFollowedBy,
      isMutual: !!isFollowing && !!isFollowedBy,
    };
  }

  async getSuggestedUsers(currentUserId: string, limit = 8) {
  const following = await this.prisma.follow.findMany({
    where: { followerId: currentUserId },
    select: { followingId: true },
  });

  const followingIds = following.map((f) => f.followingId);
  followingIds.push(currentUserId);

  const users = await this.prisma.user.findMany({
    where: {
      id: { notIn: followingIds },
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true,
      bio: true,
      isVerified: true,
      isPremium: true,

      clone: {
        select: {
          name: true,
          level: true,
          mood: true,
        },
      },

      _count: {
        select: {
          followers: true,
          following: true,
        },
      },

      followers: {
        where: { followerId: currentUserId },
        select: { id: true },
      },

      sentConnections: {
        where: { receiverId: currentUserId },
        select: {
          id: true,
          status: true,
        },
      },

      receivedConnections: {
        where: { senderId: currentUserId },
        select: {
          id: true,
          status: true,
        },
      },
    },

    orderBy: {
      followers: {
        _count: 'desc',
      },
    },

    take: limit,
  });

  return users.map((u) => ({
    id: u.id,
    username: u.username,
    displayName: u.displayName,
    avatarUrl: u.avatarUrl,
    bio: u.bio,
    isVerified: u.isVerified,
    isPremium: u.isPremium,

    clone: u.clone,

    followersCount: u._count.followers,
    followingCount: u._count.following,

    isFollowedByMe: u.followers.length > 0,

    connectionStatus: this.resolveConnectionStatus(
      u.sentConnections,
      u.receivedConnections,
    ),
  }));
}

  async getFollowers(userId: string, currentUserId: string) {
    const follows = await this.prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            isVerified: true,
            followers: {
              where: { followerId: currentUserId },
              select: { id: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return follows.map((f) => ({
      ...f.follower,
      isFollowedByMe: f.follower.followers.length > 0,
      followers: undefined,
    }));
  }

  async getFollowing(userId: string, currentUserId: string) {
    const follows = await this.prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            isVerified: true,
            followers: {
              where: { followerId: currentUserId },
              select: { id: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return follows.map((f) => ({
      ...f.following,
      isFollowedByMe: f.following.followers.length > 0,
      followers: undefined,
    }));
  }

  // ─── Connections ──────────────────────────────────────────────────────────

  async sendConnection(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      throw new BadRequestException('You cannot connect with yourself.');
    }

    const receiver = await this.prisma.user.findUnique({
      where: { id: receiverId },
    });
    if (!receiver) throw new NotFoundException('User not found.');

    const existing = await this.prisma.connection.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if (existing) {
      if (existing.status === 'ACCEPTED') {
        throw new BadRequestException('Already connected.');
      }
      if (existing.status === 'PENDING') {
        throw new BadRequestException('Connection request already sent.');
      }
      if (existing.status === 'REJECTED') {
        // Allow re-sending after rejection
        await this.prisma.connection.delete({ where: { id: existing.id } });
      }
    }

    const connection = await this.prisma.connection.create({
      data: { senderId, receiverId },
      include: {
        receiver: {
          select: {
            id: true, username: true, displayName: true, avatarUrl: true,
          },
        },
      },
    });

    return { message: 'Connection request sent.', connection };
  }

  async respondToConnection(
    currentUserId: string,
    connectionId: string,
    status: 'ACCEPTED' | 'REJECTED',
  ) {
    const connection = await this.prisma.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) throw new NotFoundException('Connection request not found.');
    if (connection.receiverId !== currentUserId) {
      throw new ForbiddenException('You cannot respond to this request.');
    }
    if (connection.status !== 'PENDING') {
      throw new BadRequestException('This request has already been responded to.');
    }

    const updated = await this.prisma.connection.update({
      where: { id: connectionId },
      data: { status },
      include: {
        sender: {
          select: {
            id: true, username: true, displayName: true, avatarUrl: true,
          },
        },
      },
    });

    // Auto-follow both users when accepted
    if (status === 'ACCEPTED') {
      await Promise.allSettled([
        this.prisma.follow.upsert({
          where: {
            followerId_followingId: {
              followerId: connection.senderId,
              followingId: currentUserId,
            },
          },
          create: { followerId: connection.senderId, followingId: currentUserId },
          update: {},
        }),
        this.prisma.follow.upsert({
          where: {
            followerId_followingId: {
              followerId: currentUserId,
              followingId: connection.senderId,
            },
          },
          create: { followerId: currentUserId, followingId: connection.senderId },
          update: {},
        }),
      ]);
    }

    return { message: `Connection ${status.toLowerCase()}.`, connection: updated };
  }

  async getConnections(userId: string) {
    const connections = await this.prisma.connection.findMany({
      where: {
        OR: [
          { senderId: userId, status: 'ACCEPTED' },
          { receiverId: userId, status: 'ACCEPTED' },
        ],
      },
      include: {
        sender: {
          select: {
            id: true, username: true, displayName: true,
            avatarUrl: true, isVerified: true,
          },
        },
        receiver: {
          select: {
            id: true, username: true, displayName: true,
            avatarUrl: true, isVerified: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return connections.map((c) => ({
      id: c.id,
      connectedAt: c.updatedAt,
      user: c.senderId === userId ? c.receiver : c.sender,
    }));
  }

  async getPendingRequests(userId: string) {
    const [received, sent] = await Promise.all([
      this.prisma.connection.findMany({
        where: { receiverId: userId, status: 'PENDING' },
        include: {
          sender: {
            select: {
              id: true, username: true, displayName: true,
              avatarUrl: true, isVerified: true,
              clone: { select: { name: true, level: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.connection.findMany({
        where: { senderId: userId, status: 'PENDING' },
        include: {
          receiver: {
            select: {
              id: true, username: true, displayName: true,
              avatarUrl: true, isVerified: true,
              clone: { select: { name: true, level: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      received: received.map((c) => ({
        id: c.id,
        user: c.sender,
        createdAt: c.createdAt,
      })),
      sent: sent.map((c) => ({
        id: c.id,
        user: c.receiver,
        createdAt: c.createdAt,
      })),
    };
  }

  async removeConnection(currentUserId: string, connectionId: string) {
    const connection = await this.prisma.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) throw new NotFoundException('Connection not found.');
    if (
      connection.senderId !== currentUserId &&
      connection.receiverId !== currentUserId
    ) {
      throw new ForbiddenException('Not your connection.');
    }

    await this.prisma.connection.delete({ where: { id: connectionId } });
    return { message: 'Connection removed.' };
  }
}