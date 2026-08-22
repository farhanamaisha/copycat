import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ClonesModule } from './clones/clones.module';
import { PostsModule } from './posts/posts.module';
import { MessagesModule } from './messages/messages.module';
import { HealthController } from './health/health.controller';
import { AiModule } from './ai/ai.module';
import { TrainingModule } from './training/training.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
    AuthModule,
    UsersModule,
    ClonesModule,
    PostsModule,
    MessagesModule,
    AiModule,
    TrainingModule,
  ],

  controllers: [
    AppController,
    HealthController,
  ],

  providers: [
    AppService,
  ],
})
export class AppModule {}