import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

type RequestWithUser = {
  user: {
    userId: string;
  };
};

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  // GET /notifications
  @Get()
  async getNotifications(
    @Req() req: RequestWithUser,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    const notifications =
      await this.notificationsService.getNotifications(
        req.user.userId,
        unreadOnly === 'true',
      );

    return {
      success: true,
      data: notifications,
    };
  }

  // GET /notifications/unread-count
  @Get('unread-count')
  async getUnreadCount(
    @Req() req: RequestWithUser,
  ) {
    const result =
      await this.notificationsService.getUnreadCount(
        req.user.userId,
      );

    return {
      success: true,
      data: result,
    };
  }

  // PATCH /notifications/read-all
  // Keep this BEFORE /:id/read
  @Patch('read-all')
  async markAllAsRead(
    @Req() req: RequestWithUser,
  ) {
    const result =
      await this.notificationsService.markAllAsRead(
        req.user.userId,
      );

    return {
      success: true,
      data: result,
    };
  }

  // PATCH /notifications/:id/read
  @Patch(':id/read')
  async markAsRead(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    const notification =
      await this.notificationsService.markAsRead(
        req.user.userId,
        id,
      );

    return {
      success: true,
      data: notification,
    };
  }

  // DELETE /notifications/:id
  @Delete(':id')
  async deleteNotification(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    const result =
      await this.notificationsService.deleteNotification(
        req.user.userId,
        id,
      );

    return {
      success: true,
      data: result,
    };
  }
}