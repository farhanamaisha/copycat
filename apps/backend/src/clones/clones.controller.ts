
import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ClonesService } from './clones.service';

type RequestWithUser = {
  user: {
    userId: string;
  };
};

@Controller('clones')
export class ClonesController {
  constructor(private clonesService: ClonesService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMyClone(@Req() req: RequestWithUser) {
    return this.clonesService.getClone(req.user.userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateMyClone(
    @Req() req: RequestWithUser,
    @Body()
    data: {
      name?: string;
      mood?: string;
      accuracyPercent?: number;
      level?: number;
      personalityProgress?: number;
    },
  ) {
    return this.clonesService.updateClone(req.user.userId, data);
  }

  @Post('me/train')
  @UseGuards(JwtAuthGuard)
  trainClone(
    @Req() req: RequestWithUser,
    @Body() body: { traitName: string; delta: number },
  ) {
    return this.clonesService.updateTraitScore(
      req.user.userId,
      body.traitName,
      body.delta,
    );
  }

  @Post('chat')
  @UseGuards(JwtAuthGuard)
  chatWithClone(
    @Req() req: RequestWithUser,
    @Body() body: { message: string },
  ) {
    return this.clonesService.chatWithClone(
      req.user.userId,
      body.message,
    );
  }

  @Get('chat/history')
  @UseGuards(JwtAuthGuard)
  getChatHistory(@Req() req: RequestWithUser) {
    return this.clonesService.getChatHistory(req.user.userId);
  }

  // ============================================================
  // CLONE MEMORY
  // ============================================================

  @Get('me/memories')
  @UseGuards(JwtAuthGuard)
  getMemories(@Req() req: RequestWithUser) {
    return this.clonesService.getMemories(req.user.userId);
  }

  @Post('me/memories')
  @UseGuards(JwtAuthGuard)
  createMemory(
    @Req() req: RequestWithUser,
    @Body()
    body: {
      memory: string;
      importance?: number;
    },
  ) {
    return this.clonesService.createMemory(
      req.user.userId,
      body.memory,
      body.importance,
    );
  }

  @Delete('me/memories/:memoryId')
  @UseGuards(JwtAuthGuard)
  deleteMemory(
    @Req() req: RequestWithUser,
    @Param('memoryId') memoryId: string,
  ) {
    return this.clonesService.deleteMemory(
      req.user.userId,
      memoryId,
    );
  }
}
