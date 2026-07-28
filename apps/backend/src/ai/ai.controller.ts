import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('train')
  async train(@Body() body: { prompt: string; response: string }) {
    return this.aiService.analyzeTraining(body.response, body.prompt);
  }
}
