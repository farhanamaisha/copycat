import { ConfigService } from '@nestjs/config';
import { AiService } from './ai.service';

describe('AiService', () => {
  it('returns a heuristic training analysis when OpenAI is unavailable', async () => {
    const service = new AiService(new ConfigService());

    const result = await service.analyzeTraining(
      'I love building things that help people feel more understood.',
      'What matters to you most?',
    );

    expect(result.summary).toContain('training');
    expect(result.traits.length).toBeGreaterThan(0);
    expect(result.pointsEarned).toBeGreaterThan(0);
    expect(result.suggestedReply).toBeTruthy();
  });
});
