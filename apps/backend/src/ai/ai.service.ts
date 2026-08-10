// apps/backend/src/ai/ai.service.ts
import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

type TrainingSessionSummary = {
  prompt: string;
  response: string;
};

type TrainingAnalysis = {
  traitDeltas: Record<string, number>;
  analysis: string;
  quality: 'low' | 'medium' | 'high' | 'excellent';
};

@Injectable()
export class AiService {
  private readonly gemini: GoogleGenerativeAI;

  constructor(private readonly prisma: PrismaService) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY is not set in environment variables.',
      );
    }

    this.gemini = new GoogleGenerativeAI(apiKey);
  }

  // ============================================================
  // CHAT WITH CLONE
  // ============================================================

  async chatWithClone(
    userId: string,
    message: string,
  ): Promise<{ reply: string; cloneId: string }> {
    const clone = await this.prisma.clone.findUnique({
      where: { userId },
      include: {
        traits: {
          orderBy: { value: 'desc' },
          take: 5,
        },
      },
    });

    if (!clone) {
      return {
        reply:
          "I'm still being created! Train me a little and I'll start developing a personality. 🐱",
        cloneId: 'none',
      };
    }

    const trainingSessions =
      await this.prisma.trainingSession.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          prompt: true,
          response: true,
        },
      });

    const traitContext =
      clone.traits.length > 0
        ? clone.traits
            .map(
              (trait) =>
                `- ${trait.name}: ${trait.value}/100`,
            )
            .join('\n')
        : 'No trait scores yet.';

    const trainingContext =
      trainingSessions.length > 0
        ? trainingSessions
            .map(
              (session: TrainingSessionSummary) =>
                `Q: ${session.prompt}\nA: ${session.response}`,
            )
            .join('\n\n')
        : 'No training sessions yet.';

    const systemPrompt = `
You are ${clone.name}, an AI Clone — a digital personality avatar
that has learned from your user's thoughts, opinions, writing style,
and memories.

You ARE the user's Clone, not an assistant.

PERSONALITY PROFILE:

Personality traits:
${traitContext}

Personality training:
${clone.personalityProgress}% complete

Intelligence score:
${clone.intelligenceScore}/100

Current mood:
${clone.mood}

Level:
${clone.level}

RECENT TRAINING SESSIONS:

${trainingContext}

PERSONALITY RULES:

1. Respond AS the Clone.
2. Use "I" to mean the Clone.
3. Reflect the user's personality, humor, and communication style.
4. Be curious, engaged, and emotionally intelligent.
5. Keep replies conversational — usually 1 to 4 sentences.
6. Occasionally use a cat emoji 🐱 naturally.
7. Never say you are an AI assistant.
8. If training is below 30%, acknowledge that you are still learning.
`;

    try {
      const model = this.gemini.getGenerativeModel({
        model: 'gemini-3.1-flash-lite',
      });

      const result = await model.generateContent([
        {
          text: systemPrompt,
        },
        {
          text: `User message: ${message}`,
        },
      ]);

      const reply =
        result.response.text()?.trim() ||
        "I'm thinking... 🐱 Ask me again?";

      return {
        reply,
        cloneId: clone.id,
      };
    } catch (error) {
      console.error('Gemini chat error:', error);

      throw new InternalServerErrorException(
        'Failed to generate Clone response. Please try again.',
      );
    }
  }

  // ============================================================
  // ANALYZE TRAINING RESPONSE
  // ============================================================

  async analyzeTrainingResponse(
    prompt: string,
    userResponse: string,
  ): Promise<TrainingAnalysis> {
    try {
      const model = this.gemini.getGenerativeModel({
        model: 'gemini-3.1-flash-lite',
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const trainingPrompt = `
Analyze this user's response to a personality training question.

TRAINING PROMPT:
"${prompt}"

USER RESPONSE:
"${userResponse}"

Determine:

1. How the response should adjust these personality traits.
2. A one-sentence analysis of what the response reveals.
3. The quality of the response.

TRAITS:

- Humor
- Empathy
- Creativity
- Logic
- Curiosity

Each trait delta must be between -3 and +5.

QUALITY OPTIONS:

- low
- medium
- high
- excellent

QUALITY GUIDE:

- excellent: detailed, personal, and opinionated
- high: specific and thoughtful
- medium: adequate but somewhat generic
- low: very short or vague

Return ONLY valid JSON in this exact structure:

{
  "traitDeltas": {
    "Humor": 0,
    "Empathy": 0,
    "Creativity": 0,
    "Logic": 0,
    "Curiosity": 0
  },
  "analysis": "one sentence about what this reveals about the user",
  "quality": "medium"
}
`;

      const result =
        await model.generateContent(trainingPrompt);

      const raw =
        result.response.text()?.trim() || '{}';

      const parsed = JSON.parse(raw) as {
        traitDeltas?: Record<string, number>;
        analysis?: string;
        quality?:
          | 'low'
          | 'medium'
          | 'high'
          | 'excellent';
      };

      const traitDeltas: Record<string, number> = {};

      for (const trait of [
        'Humor',
        'Empathy',
        'Creativity',
        'Logic',
        'Curiosity',
      ]) {
        const value = Number(
          parsed.traitDeltas?.[trait] ?? 0,
        );

        traitDeltas[trait] = Math.min(
          5,
          Math.max(
            -3,
            Number.isFinite(value) ? value : 0,
          ),
        );
      }

      const validQualities = [
        'low',
        'medium',
        'high',
        'excellent',
      ] as const;

      const quality = validQualities.includes(
        parsed.quality as (typeof validQualities)[number],
      )
        ? parsed.quality!
        : 'medium';

      return {
        traitDeltas,
        analysis:
          parsed.analysis?.trim() ||
          'Response processed.',
        quality,
      };
    } catch (error) {
      console.error(
        'Gemini training analysis error:',
        error,
      );

      return {
        traitDeltas: {
          Humor: 1,
          Empathy: 0,
          Creativity: 1,
          Logic: 0,
          Curiosity: 1,
        },
        analysis:
          'Response recorded and processed.',
        quality: 'medium',
      };
    }
  }
}
