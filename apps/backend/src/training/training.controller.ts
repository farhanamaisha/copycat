// apps/backend/src/training/training.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TrainingService } from './training.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

class SubmitTrainingDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  response: string;
}

@Controller('training')
@UseGuards(JwtAuthGuard)
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  /**
   * POST /training/submit
   * Submit a training session — analyzed by Gemini, saved to DB.
   */
  @Post('submit')
  async submitSession(
    @Request() req: { user: { userId: string } },
    @Body() dto: SubmitTrainingDto,
  ) {
    const result = await this.trainingService.submitTrainingSession(
      req.user.userId,
      dto.prompt,
      dto.response,
    );
    return { success: true, data: result };
  }

  /**
   * GET /training/sessions
   * Get training history for the current user.
   */
  @Get('sessions')
  async getSessions(@Request() req: { user: { userId: string } }) {
    const sessions = await this.trainingService.getTrainingSessions(req.user.userId);
    return { success: true, data: sessions };
  }

  /**
   * GET /training/clone
   * Get the current user's Clone with traits.
   */
  @Get('clone')
  async getClone(@Request() req: { user: { userId: string } }) {
    const clone = await this.trainingService.getMyClone(req.user.userId);
    return { success: true, data: clone };
  }
}