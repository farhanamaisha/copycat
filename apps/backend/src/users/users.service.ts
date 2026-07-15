import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findById(id: string) {
  const user = await this.prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      emailVerified: true,
    },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    displayName: user.username,
    email: user.email,
    avatarUrl: null,
    bio: null,
    followersCount: 0,
    followingCount: 0,
    clowdersCount: 0,
    createdAt: user.createdAt,
    isVerified: user.emailVerified,
    isPremium: false,
  };
}
}