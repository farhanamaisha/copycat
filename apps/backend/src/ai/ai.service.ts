import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  constructor(private readonly configService: ConfigService) {}

  async analyzeTraining(response: string, prompt: string) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!apiKey) {
      return this.buildHeuristicAnalysis(response, prompt);
    }

    try {
      const model = this.configService.get<string>('OPENAI_MODEL') || 'gpt-4o-mini';
      const body = {
        model,
        messages: [
          {
            role: 'system',
            content:
              'You help analyze personal training responses for a clone personality system. Return JSON with summary, traits, pointsEarned, suggestedReply.',
          },
          {
            role: 'user',
            content: `Prompt: ${prompt}\nResponse: ${response}`,
          },
        ],
        temperature: 0.7,
      };

      const responseFromOpenAI = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!responseFromOpenAI.ok) {
        throw new Error('OpenAI request failed');
      }

      const parsed = (await responseFromOpenAI.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };

      const content = parsed.choices?.[0]?.message?.content ?? '{}';
      const parsedContent = JSON.parse(content);

      return {
        summary: parsedContent.summary ?? 'Training analyzed successfully.',
        traits: parsedContent.traits ?? this.buildHeuristicTraits(response),
        pointsEarned: parsedContent.pointsEarned ?? 3,
        suggestedReply: parsedContent.suggestedReply ?? 'Thanks for sharing that.',
      };
    } catch {
      return this.buildHeuristicAnalysis(response, prompt);
    }
  }

  private buildHeuristicAnalysis(response: string, prompt: string) {
    const traits = this.buildHeuristicTraits(response);

    return {
      summary: `Training analyzed from your response to "${prompt}".`,
      traits,
      pointsEarned: Math.min(5, 2 + Math.floor(response.trim().length / 120)),
      suggestedReply: 'That sounds thoughtful. Tell me more about why that matters to you.',
    };
  }

  private buildHeuristicTraits(response: string) {
    const lower = response.toLowerCase();
    const traits = [] as Array<{ name: string; delta: number }>;

    if (lower.includes('i') || lower.includes('feel') || lower.includes('love')) {
      traits.push({ name: 'Empathy', delta: 2 });
    }
    if (lower.includes('why') || lower.includes('because') || lower.includes('think')) {
      traits.push({ name: 'Logic', delta: 2 });
    }
    if (lower.includes('fun') || lower.includes('joy') || lower.includes('laugh')) {
      traits.push({ name: 'Humor', delta: 2 });
    }
    if (traits.length === 0) {
      traits.push({ name: 'Curiosity', delta: 1 });
    }

    return traits;
  }
}
