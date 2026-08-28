import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClonesService {
  constructor(private prisma: PrismaService) {}

  // ============================================================
  // GET MY CLONE
  // ============================================================

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

  // ============================================================
  // UPDATE MY CLONE
  // ============================================================

  async updateClone(
    userId: string,
    data: {
      name?: string;
      mood?: string;
      accuracyPercent?: number;
      level?: number;
      personalityProgress?: number;
      avatarUrl?: string;
      avatarConfig?: string;
    },
  ) {
    const clone = await this.prisma.clone.update({
      where: { userId },
      data: {
        ...(data.name !== undefined && {
          name: data.name,
        }),

        ...(data.mood !== undefined && {
          mood: data.mood,
        }),

        ...(data.accuracyPercent !== undefined && {
          accuracyPercent: data.accuracyPercent,
        }),

        ...(data.level !== undefined && {
          level: data.level,
        }),

        ...(data.personalityProgress !== undefined && {
          personalityProgress: data.personalityProgress,
        }),

        ...(data.avatarUrl !== undefined && {
          avatarUrl: data.avatarUrl,
        }),

        ...(data.avatarConfig !== undefined && {
          avatarConfig: data.avatarConfig,
        }),
      },
      include: {
        traits: true,
      },
    });

    return this.formatClone(clone);
  }

  // ============================================================
  // UPDATE TRAIT SCORE
  // ============================================================

  async updateTraitScore(
    userId: string,
    traitName: string,
    delta: number,
  ) {
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
      : Math.min(100, Math.max(0, delta));

    if (currentTrait) {
      await this.prisma.traitScore.update({
        where: {
          id: currentTrait.id,
        },
        data: {
          value: newValue,
        },
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

    return {
      traitName,
      newValue,
    };
  }

  // ============================================================
  // CHAT WITH CLONE
  // ============================================================

  async chatWithClone(
    userId: string,
    message: string,
  ) {
    const clone = await this.prisma.clone.findUnique({
      where: { userId },
    });

    if (!clone) {
      throw new NotFoundException('Clone not found');
    }

    // Find existing conversation
    let conversation =
      await this.prisma.chatConversation.findFirst({
        where: {
          userId,
          cloneId: clone.id,
        },
      });

    // Create conversation first time
    if (!conversation) {
      conversation =
        await this.prisma.chatConversation.create({
          data: {
            userId,
            cloneId: clone.id,
            title: 'Clone Chat',
          },
        });
    }

    // Save user message
    await this.prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'USER',
        content: message,
      },
    });

    // Temporary clone brain
    let reply = '';

    const text = message.toLowerCase();

    if (text.includes('name')) {
      reply = `My name is ${clone.name}. I am your digital clone.`;
    } else if (
      text.includes('hi') ||
      text.includes('hello')
    ) {
      reply = `Hey! Good to see you again. I'm feeling ${clone.mood} today.`;
    } else if (text.includes('how are you')) {
      reply =
        "I'm doing great. I'm learning from our conversations.";
    } else {
      reply = `That's interesting. Tell me more about ${message}.`;
    }

    // Save clone reply
    await this.prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'CLONE',
        content: reply,
      },
    });

    return {
      reply,
      cloneId: clone.id,
    };
  }

  // ============================================================
  // FORMAT CLONE
  // ============================================================

  private formatClone(clone: any) {
    return {
      id: clone.id,
      userId: clone.userId,

      name: clone.name,

      avatarUrl: clone.avatarUrl || null,

      // IMPORTANT:
      // Return avatarConfig so frontend can load it
      // after refreshing the page.
      avatarConfig: clone.avatarConfig || null,

      personalityProgress:
        clone.personalityProgress ?? 0,

      intelligenceScore:
        clone.intelligenceScore ?? 0,

      level: clone.level ?? 1,

      accuracyPercent:
        clone.accuracyPercent ?? 0,

      mood: clone.mood || 'curious',

      isOnline:
        clone.isOnline ?? false,

      trainingCount:
        clone.trainingCount ?? 0,

      traits: (clone.traits || []).map(
        (t: any) => ({
          id: t.id,
          name: t.name,
          value: t.value,
        }),
      ),

      recentActivity: [],

      lastActive: clone.lastActive,

      createdAt: clone.createdAt,

      updatedAt: clone.updatedAt,
    };
  }

  // ============================================================
  // CHAT HISTORY
  // ============================================================

  async getChatHistory(userId: string) {
    const clone = await this.prisma.clone.findUnique({
      where: { userId },
    });

    if (!clone) {
      throw new NotFoundException('Clone not found');
    }

    const conversation =
      await this.prisma.chatConversation.findFirst({
        where: {
          userId,
          cloneId: clone.id,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });

    if (!conversation) {
      return [];
    }

    return conversation.messages.map(
      (msg) => ({
        from:
          msg.role === 'USER'
            ? 'user'
            : 'clone',
        text: msg.content,
      }),
    );
  }

  // ============================================================
  // CLONE MEMORIES
  // ============================================================

  async getMemories(userId: string) {
    const clone = await this.prisma.clone.findUnique({
      where: { userId },
    });

    if (!clone) {
      throw new NotFoundException('Clone not found');
    }

    return this.prisma.cloneMemory.findMany({
      where: {
        cloneId: clone.id,
      },
      orderBy: [
        {
          importance: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });
  }

  // ============================================================
  // CREATE MEMORY
  // ============================================================

  async createMemory(
    userId: string,
    memory: string,
    importance = 50,
  ) {
    const clone = await this.prisma.clone.findUnique({
      where: { userId },
    });

    if (!clone) {
      throw new NotFoundException('Clone not found');
    }

    if (!memory || !memory.trim()) {
      throw new Error('Memory cannot be empty');
    }

    const safeImportance = Math.min(
      100,
      Math.max(0, Number(importance)),
    );

    return this.prisma.cloneMemory.create({
      data: {
        cloneId: clone.id,
        memory: memory.trim(),
        importance: safeImportance,
      },
    });
  }

  // ============================================================
  // DELETE MEMORY
  // ============================================================

  async deleteMemory(
    userId: string,
    memoryId: string,
  ) {
    const clone = await this.prisma.clone.findUnique({
      where: { userId },
    });

    if (!clone) {
      throw new NotFoundException('Clone not found');
    }

    const memory =
      await this.prisma.cloneMemory.findFirst({
        where: {
          id: memoryId,
          cloneId: clone.id,
        },
      });

    if (!memory) {
      throw new NotFoundException(
        'Memory not found',
      );
    }

    await this.prisma.cloneMemory.delete({
      where: {
        id: memoryId,
      },
    });

    return {
      success: true,
      message: 'Memory deleted successfully',
    };
  }
}