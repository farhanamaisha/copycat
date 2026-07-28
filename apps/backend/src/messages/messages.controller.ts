import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MessagesService } from './messages.service';

interface MessagePayload {
  recipientId: string;
  content: string;
}

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get('conversations')
  @UseGuards(JwtAuthGuard)
  getConversations(@Req() req) {
    return this.messagesService.getConversations(req.user.userId);
  }

  @Get(':conversationId')
  @UseGuards(JwtAuthGuard)
  getMessages(@Param('conversationId') conversationId: string, @Req() req) {
    return this.messagesService.getMessages(conversationId, req.user.userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  sendMessage(@Req() req, @Body() payload: MessagePayload) {
    return this.messagesService.sendMessage(
      req.user.userId,
      payload.recipientId,
      payload.content,
    );
  }
}
