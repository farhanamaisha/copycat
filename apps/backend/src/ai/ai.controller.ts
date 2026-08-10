// apps/backend/src/ai/ai.controller.ts
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AiService } from './ai.service';
import { CloneChatDto } from './dto/chat.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /**y
   * POST /ai/clone/chat
   * Send a message to the authenticated user's Clone.
   * Requires a valid JWT (user must be logged in).
   */
@Post('clone/chat')
async chatWithClone(
  @Request() req: { user: { userId: string } },
  @Body() dto: CloneChatDto,
) {
  console.log('========== AI CHAT REQUEST ==========');
  console.log('User ID:', req.user.userId);
  console.log('Message:', dto.message);

  try {
    const result = await this.aiService.chatWithClone(
      req.user.userId,
      dto.message,
    );

    console.log('AI CHAT SUCCESS:', result);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('========== AI CHAT ERROR ==========');
    console.error(error);
    throw error;
  }
}

  /**
   * POST /ai/clone/analyze
   * Analyze a training response and return trait deltas.
   * Used by the training system.
   */
  @Post('clone/analyze')
  async analyzeTraining(@Body() body: { prompt: string; response: string }) {
    const result = await this.aiService.analyzeTrainingResponse(
      body.prompt,
      body.response,
    );
    return { success: true, data: result };
  }
}
