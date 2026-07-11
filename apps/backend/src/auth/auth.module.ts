import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { JwtStrategy } from './strategies/jwt.strategy';

import { PrismaService } from '../prisma/prisma.service';
import { MailModule } from '../mail/mail.module';

@Module({

  imports: [

    PassportModule,
     MailModule,
    JwtModule.register({
      secret:
        process.env.JWT_SECRET || 'copy-cat-secret',

      signOptions: {
        expiresIn: '7d',
      },
    }),

  ],


  controllers: [
    AuthController,
  ],


  providers: [
    AuthService,
    JwtStrategy,
    PrismaService,
  ],

})
export class AuthModule {}