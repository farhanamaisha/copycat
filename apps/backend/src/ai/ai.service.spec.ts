// apps/backend/src/ai/ai.service.spec.ts

import { AiService } from './ai.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AiService', () => {
  it('throws when GEMINI_API_KEY is missing', () => {
    delete process.env.GEMINI_API_KEY;

    expect(() => new AiService({} as PrismaService)).toThrow(
      'GEMINI_API_KEY is not set in environment variables.',
    );
  });
});