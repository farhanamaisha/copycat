import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClonesService {
  constructor(private prisma: PrismaService) {}

  async getClone(userId: string) {
    const clone = await this.prisma.clone.findUnique({
      where: { userId },
      include: {
        traits: true,
      },
    });

    if (!clone) {
      throw new NotFoundException('Clone not found');
    }

    return this.formatClone(clone);
  }

  async updateClone(
    userId: string,
    data: {
      name?: string;
      mood?: string;
      accuracyPercent?: number;
      level?: number;
      personalityProgress?: number;
    },
  ) {
    const clone = await this.prisma.clone.update({
      where: { userId },
      data,
      include: {
        traits: true,
      },
    });

    return this.formatClone(clone);
  }

  async updateTraitScore(userId: string, traitName: string, delta: number) {
    const clone = await this.prisma.clone.findUnique({
      where: { userId },
    });

    if (!clone) {
      throw new NotFoundException('Clone not found');
    }

    const currentTrait = await this.prisma.traitScore.findUnique({
      where: {
        cloneId_name: {
          cloneId: clone.id,
          name: traitName,
        },
      },
    });

    const newValue = currentTrait
      ? Math.min(100, Math.max(0, currentTrait.value + delta))
      : Math.max(0, delta);

    if (currentTrait) {
      await this.prisma.traitScore.update({
        where: { id: currentTrait.id },
        data: { value: newValue },
      });
    } else {
      await this.prisma.traitScore.create({
        data: {
          cloneId: clone.id,
          name: traitName,
          value: newValue,
        },
      });
    }

    return { traitName, newValue };
  }

  private formatClone(clone: any) {
    return {
      id: clone.id,
      userId: clone.userId,
      name: clone.name,
      avatarUrl: clone.avatarUrl || null,
      personalityProgress: clone.personalityProgress || 0,
      intelligenceScore: clone.intelligenceScore || 0,
      level: clone.level || 1,
      accuracyPercent: clone.accuracyPercent || 0,
      mood: clone.mood || 'curious',
      isOnline: clone.isOnline || false,
      trainingCount: clone.trainingCount || 0,
      traits: (clone.traits || []).map((t: any) => ({
        name: t.name,
        value: t.value,
      })),
      recentActivity: [],
      lastActive: clone.lastActive,
      createdAt: clone.createdAt,
      updatedAt: clone.updatedAt,
    };
  }
}
