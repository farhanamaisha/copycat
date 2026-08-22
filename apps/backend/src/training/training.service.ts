// apps/backend/src/training/training.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class TrainingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
  ) {}

  async submitTrainingSession(
    userId: string,
    prompt: string,
    response: string,
  ) {
    // Get the user's Clone
    const clone = await this.prisma.clone.findUnique({
      where: { userId },
      include: { traits: true },
    });

    if (!clone) {
      throw new NotFoundException(
        'Clone not found. Please create your Clone first.',
      );
    }

    // Analyze with Gemini
    const analysis = await this.aiService.analyzeTrainingResponse(
      prompt,
      response,
    );

    // Calculate points from quality — ai.service doesn't return pointsEarned
    const pointsEarned =
      analysis.quality === 'excellent' ? 10
      : analysis.quality === 'high' ? 7
      : analysis.quality === 'medium' ? 4
      : 1;

    // Save training session to DB
    const session = await this.prisma.trainingSession.create({
      data: {
        userId,
        prompt,
        response,
        analysis: JSON.stringify({
          summary: analysis.analysis,
          quality: analysis.quality,
        }),
        pointsEarned,
        traitsImproved: {
          create: Object.entries(analysis.traitDeltas)
            .filter(([, delta]) => delta !== 0)
            .map(([traitName, delta]) => ({ traitName, delta })),
        },
      },
      include: { traitsImproved: true },
    });

    // Update Clone trait scores
    for (const [traitName, delta] of Object.entries(analysis.traitDeltas)) {
      if (delta === 0) continue;

      const existing = clone.traits.find((t) => t.name === traitName);

      if (existing) {
        await this.prisma.traitScore.update({
          where: { id: existing.id },
          data: {
            value: Math.min(100, Math.max(0, existing.value + delta)),
          },
        });
      } else {
        await this.prisma.traitScore.create({
          data: {
            cloneId: clone.id,
            name: traitName,
            value: Math.min(100, Math.max(0, delta)),
          },
        });
      }
    }

    // Update Clone overall progress and training count
    const newProgress = Math.min(
      100,
      clone.personalityProgress +
        (analysis.quality === 'excellent' ? 2
        : analysis.quality === 'high' ? 1
        : 0.5),
    );

    await this.prisma.clone.update({
      where: { id: clone.id },
      data: {
        trainingCount: { increment: 1 },
        personalityProgress: newProgress,
        lastActive: new Date(),
      },
    });

    // Fetch updated Clone to return fresh state
    const updatedClone = await this.prisma.clone.findUnique({
      where: { id: clone.id },
      include: { traits: true },
    });

    return {
      session: {
        id: session.id,
        prompt,
        userResponse: response,
        aiAnalysis: analysis.analysis,
        traitDeltas: analysis.traitDeltas,
        pointsEarned,
        quality: analysis.quality,
        createdAt: session.createdAt,
      },
      clone: updatedClone,
    };
  }

  async getTrainingSessions(userId: string) {
    const sessions = await this.prisma.trainingSession.findMany({
      where: { userId },
      include: { traitsImproved: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return sessions.map((s) => ({
      id: s.id,
      prompt: s.prompt,
      userResponse: s.response,
      aiAnalysis: s.analysis
        ? (JSON.parse(s.analysis) as { summary: string }).summary
        : '',
      quality: s.analysis
        ? (JSON.parse(s.analysis) as { quality: string }).quality
        : 'medium',
      traitDeltas: s.traitsImproved.reduce<Record<string, number>>(
        (acc, t) => ({ ...acc, [t.traitName]: t.delta }),
        {},
      ),
      pointsEarned: s.pointsEarned,
      createdAt: s.createdAt,
    }));
  }

  async getMyClone(userId: string) {
    const clone = await this.prisma.clone.findUnique({
      where: { userId },
      include: { traits: true },
    });

    if (!clone) throw new NotFoundException('Clone not found.');
    return clone;
  }
}