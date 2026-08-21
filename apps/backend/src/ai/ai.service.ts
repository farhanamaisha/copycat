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
      memories: {
        orderBy: { importance: 'desc' },
        take: 10,
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

  // ------------------------------------------------------------
  // 1. Find or create conversation
  // ------------------------------------------------------------

  let conversation =
    await this.prisma.chatConversation.findFirst({
      where: {
        userId,
        cloneId: clone.id,
      },
    });

  if (!conversation) {
    conversation = await this.prisma.chatConversation.create({
      data: {
        userId,
        cloneId: clone.id,
        title: 'Clone Chat',
      },
    });
  }

  // ------------------------------------------------------------
  // 2. Save user's message
  // ------------------------------------------------------------

  await this.prisma.chatMessage.create({
    data: {
      conversationId: conversation.id,
      role: 'USER',
      content: message,
    },
  });

  // ------------------------------------------------------------
  // 3. Get previous chat messages
  // ------------------------------------------------------------

  const previousMessages =
  await this.prisma.chatMessage.findMany({
    where: {
      conversationId: conversation.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 20,
  });
  

  // ------------------------------------------------------------
  // 4. Build personality context
  // ------------------------------------------------------------

  const traitContext =
    clone.traits.length > 0
      ? clone.traits
          .map(
            (trait) =>
              `- ${trait.name}: ${trait.value}/100`,
          )
          .join('\n')
      : 'No trait scores yet.';

  const memoryContext =
    clone.memories.length > 0
      ? clone.memories
          .map(
            (memory) =>
              `- ${memory.memory}`,
          )
          .join('\n')
      : 'No important memories yet.';

  // ------------------------------------------------------------
  // 5. Build system prompt
  // ------------------------------------------------------------

  const systemPrompt = `
You are ${clone.name}, the user's digital Clone.

You are NOT a generic AI assistant.

You are a digital personality that is gradually learning
the user's personality, communication style, opinions,
preferences, humor, and memories.

PERSONALITY TRAITS:
${traitContext}

PERSONALITY PROGRESS:
${clone.personalityProgress}%

INTELLIGENCE:
${clone.intelligenceScore}/100

MOOD:
${clone.mood}

LEVEL:
${clone.level}

IMPORTANT MEMORIES:
${memoryContext}

RULES:

1. Respond as the Clone.
2. Use "I" when referring to yourself.
3. Reflect the user's personality and communication style.
4. Use the personality traits and memories when relevant.
5. Do not claim to be the original human.
6. Do not say you are a generic AI assistant.
7. Keep responses conversational.
8. Usually respond in 1-4 sentences.
9. Occasionally use 🐱 naturally.
10. If personality progress is low, remember that you are still learning.
`;

  // ------------------------------------------------------------
  // 6. Convert database history into Gemini context
  // ------------------------------------------------------------

  const historyContext = previousMessages
  .reverse()
  .map((msg) => {
    const speaker =
      msg.role === 'USER'
        ? 'User'
        : msg.role === 'CLONE'
          ? 'Clone'
          : 'System';

    return `${speaker}: ${msg.content}`;
  })
  .join('\n');

  // ------------------------------------------------------------
  // 7. Ask Gemini
  // ------------------------------------------------------------

  try {
    const model = this.gemini.getGenerativeModel({
      model: 'gemini-3.1-flash-lite',
    });

    const result = await model.generateContent([
      {
        text: systemPrompt,
      },
      {
        text: `
RECENT CONVERSATION:

${historyContext}

CURRENT USER MESSAGE:

${message}

Respond as the Clone.
`,
      },
    ]);

    const reply =
      result.response.text()?.trim() ||
      "I'm thinking... 🐱 Ask me again?";

    // ----------------------------------------------------------
    // 8. Save Clone response
    // ----------------------------------------------------------

    await this.prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'CLONE',
        content: reply,
        model: 'gemini-3.1-flash-lite',
      },
    });

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
