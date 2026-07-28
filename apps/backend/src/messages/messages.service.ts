import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getConversations(userId: string) {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            email: true,
            avatarUrl: true,
            bio: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            displayName: true,
            email: true,
            avatarUrl: true,
            bio: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Group messages by conversation (sender and receiver)
    const conversationMap = new Map<string, any>();

    for (const message of messages) {
      const otherUserId =
        message.senderId === userId ? message.receiverId : message.senderId;
      const otherUser =
        message.senderId === userId ? message.receiver : message.sender;

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          id: otherUserId, // Use the other user's ID as conversation ID
          type: 'direct',
          participant: {
            id: otherUser.id,
            username: otherUser.username,
            displayName: otherUser.displayName || otherUser.username,
            email: otherUser.email,
            avatarUrl: otherUser.avatarUrl || null,
            bio: otherUser.bio || null,
            followersCount: 0,
            followingCount: 0,
            clowdersCount: 0,
            createdAt: new Date().toISOString(),
            isVerified: false,
            isPremium: false,
          },
          lastMessage: {
            id: message.id,
            senderId: message.senderId,
            content: message.content,
            createdAt: message.createdAt.toISOString(),
            isRead: message.isRead,
          },
          unreadCount: 0,
          updatedAt: message.updatedAt.toISOString(),
        });
      }

      // Count unread messages for this conversation
      const convData = conversationMap.get(otherUserId);
      if (message.receiverId === userId && !message.isRead) {
        convData.unreadCount++;
      }
    }

    return Array.from(conversationMap.values());
  }

  async getMessages(conversationId: string, userId: string) {
    // conversationId is the other user's ID
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            receiverId: conversationId,
          },
          {
            senderId: conversationId,
            receiverId: userId,
          },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Mark messages as read (messages received by the user)
    await this.prisma.message.updateMany({
      where: {
        receiverId: userId,
        senderId: conversationId,
        isRead: false,
      },
      data: { isRead: true },
    });

    return messages.map((msg) => ({
      id: msg.id,
      conversationId: conversationId,
      senderId: msg.senderId,
      senderName: msg.sender.displayName || msg.sender.username,
      senderAvatar: msg.sender.avatarUrl || null,
      content: msg.content,
      type: 'text',
      attachments: [],
      reactions: [],
      isRead: msg.isRead,
      isEdited: false,
      createdAt: msg.createdAt.toISOString(),
      updatedAt: msg.updatedAt.toISOString(),
    }));
  }

  async sendMessage(senderId: string, recipientId: string, content: string) {
    const message = await this.prisma.message.create({
      data: {
        senderId,
        receiverId: recipientId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return {
      id: message.id,
      conversationId: recipientId,
      senderId: message.senderId,
      senderName: message.sender.displayName || message.sender.username,
      senderAvatar: message.sender.avatarUrl || null,
      content: message.content,
      type: 'text',
      attachments: [],
      reactions: [],
      isRead: false,
      isEdited: false,
      createdAt: message.createdAt.toISOString(),
      updatedAt: message.updatedAt.toISOString(),
    };
  }
}
