import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService:MailService,
  ) {}


  // =========================
  // REGISTER + EMAIL VERIFY TOKEN
  // =========================

  async register(dto: RegisterDto) {

    const existingUser =
  await this.prisma.user.findFirst({
    where: {
      OR: [
        { email: dto.email },
        { username: dto.username },
      ],
    },
  });

const existingPending =
  await this.prisma.pendingUser.findFirst({
    where: {
      OR: [
        { email: dto.email },
        { username: dto.username },
      ],
    },
  });

if (existingUser || existingPending) {
  throw new BadRequestException(
    'Username or email already exists',
  );
}


   


    const hashedPassword =
      await bcrypt.hash(
        dto.password,
        10,
      );


    const pending =
await this.prisma.pendingUser.create({
  data:{
    username:dto.username,
    email:dto.email,
    password:hashedPassword,
    token:crypto.randomUUID(),
    expiresAt:new Date(
      Date.now() + 1000 * 60 * 60 * 24
    ),
  },
});


    

  await this.mailService.sendVerificationEmail(
 pending.email,
 pending.token,
);

return {
 message:'Verification email sent',
};
  }



  // =========================
  // VERIFY EMAIL
  // =========================

  async verifyEmail(token: string) {

  const pending =
    await this.prisma.pendingUser.findUnique({
      where:{
        token,
      },
    });


  if(!pending){
    throw new BadRequestException(
      'Invalid verification token',
    );
  }


  if(pending.expiresAt < new Date()){
    throw new BadRequestException(
      'Verification token expired',
    );
  }


  await this.prisma.user.create({
    data:{
      username: pending.username,
      email: pending.email,
      password: pending.password,
      emailVerified:true,
    },
  });


  await this.prisma.pendingUser.delete({
    where:{
      id: pending.id,
    },
  });


  return {
    message:
      'Email verified. Account created successfully',
  };

}


  // =========================
  // LOGIN
  // =========================

async login(dto: LoginDto) {
  try {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.createToken(user.id, user.email);
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    throw err;
  }
}



  // =========================
  // JWT TOKEN
  // =========================

  private createToken(
    id:string,
    email:string,
  ){


    return {

      accessToken:

        this.jwtService.sign({

          sub:id,

          email,

        }),

    };

  }

}