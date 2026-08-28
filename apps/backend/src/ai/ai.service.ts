// apps/backend/src/ai/ai.service.ts

import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

type TrainingAnalysis = {
  traitDeltas: Record<string, number>;
  analysis: string;
  quality: 'low' | 'medium' | 'high' | 'excellent';
  memory: string | null;
  memoryImportance: number;
};

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly gemini: GoogleGenerativeAI;

  constructor(private readonly prisma: PrismaService) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY is not set in environment variables.',
      );
    }

    this.gemini = new GoogleGenerativeAI(apiKey);

    this.logger.log('Gemini AI service initialized.');
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

    // ----------------------------------------------------------
    // Find or create conversation
    // ----------------------------------------------------------

    let conversation =
      await this.prisma.chatConversation.findFirst({
        where: {
          userId,
          cloneId: clone.id,
        },
      });

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

    // ----------------------------------------------------------
    // Save user message
    // ----------------------------------------------------------

    await this.prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'USER',
        content: message,
      },
    });

    // ----------------------------------------------------------
    // Get previous messages
    // ----------------------------------------------------------

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

    // ----------------------------------------------------------
    // Personality context
    // ----------------------------------------------------------

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

    // ----------------------------------------------------------
    // System prompt
    // ----------------------------------------------------------

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
2. Use IMPORTANT MEMORIES as factual knowledge about the user.
3. If the user asks about a fact contained in IMPORTANT MEMORIES,
   answer using that memory directly.
4. Do not say you don't know something if the answer is present
   in IMPORTANT MEMORIES.
5. If information is not present in memories or conversation,
   do not invent it.
6. Use "I" when referring to yourself.
7. Reflect the user's personality and communication style.
8. Use personality traits and memories when relevant.
9. Do not claim to be the original human.
10. Do not say you are a generic AI assistant.
11. Keep responses conversational.
12. Usually respond in 1-4 sentences.
13. Occasionally use 🐱 naturally.
14. If personality progress is low, remember that you are still learning.
`;

    // ----------------------------------------------------------
    // Conversation context
    // ----------------------------------------------------------

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

    // ----------------------------------------------------------
    // Gemini
    // ----------------------------------------------------------

    try {
      this.logger.log(
        `Generating Clone response for user ${userId}`,
      );

      const model =
        this.gemini.getGenerativeModel({
          model: 'gemini-3.1-flash-lite',
        });

      const result =
        await model.generateContent([
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

      // --------------------------------------------------------
      // Save Clone response
      // --------------------------------------------------------

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
      this.logger.error(
        'Gemini chat generation failed',
        error instanceof Error
          ? error.stack
          : String(error),
      );

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
      this.logger.log(
        'Starting Gemini training analysis...',
      );

      const model =
        this.gemini.getGenerativeModel({
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
2. A one-sentence analysis of what the response reveals about the user.
3. The quality of the response.
4. Whether the response contains an important personal fact that
   the Clone should remember for future conversations.

IMPORTANT MEMORY RULE:

Create a memory ONLY when the response contains a useful personal
fact, preference, relationship, identity detail, experience,
opinion, or other information that would help the Clone answer
future questions.

Examples:

- "My brother's name is Rahim."
- "My favorite color is blue."
- "I live in Sylhet."
- "I hate spicy food."
- "My dog is named Bruno."
- "I study Computer Science."
- "I prefer tea over coffee."

Do NOT create memories for:

- Generic answers
- Temporary information
- Questions themselves
- Instructions
- Information that contains no useful personal fact

If there is no useful memory, return null.

MEMORY IMPORTANCE:

Use a number from 1 to 10.

1-3 = minor information
4-6 = useful information
7-8 = important personal information
9-10 = very important identity/family/preference information

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

Return ONLY valid JSON in exactly this structure:

{
  "traitDeltas": {
    "Humor": 0,
    "Empathy": 0,
    "Creativity": 0,
    "Logic": 0,
    "Curiosity": 0
  },
  "analysis": "one sentence about what this reveals about the user",
  "quality": "medium",
  "memory": null,
  "memoryImportance": 1
}
`;

      const result =
        await model.generateContent(trainingPrompt);

      const raw =
        result.response.text()?.trim() || '';

      this.logger.log(
        `Gemini training response: ${raw.slice(0, 500)}`,
      );

      if (!raw) {
        throw new Error(
          'Gemini returned an empty training response.',
        );
      }

      let parsed: {
        traitDeltas?: Record<string, number>;
        analysis?: string;
        quality?: 'low' | 'medium' | 'high' | 'excellent';
        memory?: string | null;
        memoryImportance?: number;
      };

      try {
        parsed = JSON.parse(raw);
      } catch {
        this.logger.error(
          `Gemini returned invalid JSON: ${raw}`,
        );

        throw new Error(
          'Gemini returned invalid JSON.',
        );
      }

      // --------------------------------------------------------
      // Trait deltas
      // --------------------------------------------------------

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

      // --------------------------------------------------------
      // Quality
      // --------------------------------------------------------

      const validQualities = [
        'low',
        'medium',
        'high',
        'excellent',
      ] as const;

      const quality =
        validQualities.includes(
          parsed.quality as
            (typeof validQualities)[number],
        )
          ? parsed.quality!
          : 'medium';

      // --------------------------------------------------------
      // Memory
      // --------------------------------------------------------

      const memory =
        typeof parsed.memory === 'string' &&
        parsed.memory.trim().length > 0
          ? parsed.memory.trim()
          : null;

      const importanceNumber = Number(
        parsed.memoryImportance,
      );

      const memoryImportance = Math.min(
        10,
        Math.max(
          1,
          Number.isFinite(importanceNumber)
            ? importanceNumber
            : 1,
        ),
      );

      const analysis =
        typeof parsed.analysis === 'string' &&
        parsed.analysis.trim()
          ? parsed.analysis.trim()
          : 'Response processed.';

      this.logger.log(
        `Training analysis complete. Quality: ${quality}`,
      );

      if (memory) {
        this.logger.log(
          `Training memory detected: ${memory}`,
        );
      }

      return {
        traitDeltas,
        analysis,
        quality,
        memory,
        memoryImportance,
      };
    } catch (error) {
      this.logger.error(
        'Gemini training analysis failed',
        error instanceof Error
          ? error.stack
          : String(error),
      );

      // IMPORTANT:
      // Do NOT silently pretend Gemini succeeded.
      throw new InternalServerErrorException(
        'Gemini training analysis failed. Please try again.',
      );
    }
  }
}
