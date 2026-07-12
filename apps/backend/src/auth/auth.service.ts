import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ServiceUnavailableException,
  ConflictException,
  Logger,
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

  private readonly logger = new Logger(AuthService.name);


  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}


  // =====================================
  // REGISTER
  // =====================================

  async register(dto: RegisterDto) {

    /*
      1. Check verified email
    */

    const existingUserByEmail =
      await this.prisma.user.findUnique({
        where:{
          email:dto.email,
        },
      });


    if(existingUserByEmail){

      throw new ConflictException(
        'An account with this email already exists.',
      );

    }



    /*
      2. Check verified username
    */

    const existingUsername =
      await this.prisma.user.findUnique({
        where:{
          username:dto.username,
        },
      });


    if(existingUsername){

      throw new ConflictException(
        'Username already taken.',
      );

    }



    /*
      3. Check pending registration
    */

    const pendingUser =
      await this.prisma.pendingUser.findUnique({
        where:{
          email:dto.email,
        },
      });



    const token =
      this.generateVerificationToken();



    const expiresAt =
      new Date(
        Date.now() + 
        1000 * 60 * 60 * 24
      );



    /*
      Existing pending account
      --------------------------------
      regenerate verification
    */

    if(pendingUser){


      const updatedPending =
        await this.prisma.pendingUser.update({

          where:{
            id:pendingUser.id,
          },

          data:{

            username:dto.username,

            token,

            expiresAt,

          },

        });



      try{

        await this.mailService.sendVerificationEmail(
          updatedPending.email,
          updatedPending.token,
        );


      }catch(error){

        this.logger.error(
          'Verification email resend failed',
          error,
        );


        throw new ServiceUnavailableException(
          'Registration exists but verification email could not be sent. Please try again later.',
        );

      }



      return {

        message:
        'A verification email has been sent. Please check your inbox.',

      };

    }




    /*
      New registration
    */


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

          token,

          expiresAt,

        },

      });



    try{


      await this.mailService.sendVerificationEmail(
        pending.email,
        pending.token,
      );


    }catch(error){


      this.logger.error(
        'Verification email failed',
        error,
      );


      throw new ServiceUnavailableException(
        'Your registration was created but verification email could not be sent. Please try again later.',
      );

    }



    return {

      message:
      'A verification email has been sent. Please check your inbox.',

    };

  }





  // =====================================
  // VERIFY EMAIL
  // =====================================

  async verifyEmail(token:string){


    const pending =
      await this.prisma.pendingUser.findUnique({

        where:{
          token,
        },

      });



    if(!pending){

      throw new BadRequestException(
        'Invalid verification token.',
      );

    }



    if(
      pending.expiresAt < new Date()
    ){

      throw new BadRequestException(
        'Verification token expired. Please request a new verification email.',
      );

    }




    await this.prisma.$transaction(
      async(tx)=>{


        await tx.user.create({

          data:{

            username:
            pending.username,

            email:
            pending.email,

            password:
            pending.password,

            emailVerified:true,

          },

        });



        await tx.pendingUser.delete({

          where:{
            id:pending.id,
          },

        });


      },
    );




    return {

      message:
      'Email verified. Account created successfully.',

    };


  }




  // =====================================
  // RESEND VERIFICATION
  // =====================================

  async resendVerification(email:string){


    const pending =
      await this.prisma.pendingUser.findUnique({

        where:{
          email,
        },

      });



    if(!pending){

      return {

        message:
        'If an account is waiting for verification, a new email has been sent.',

      };

    }




    const token =
      this.generateVerificationToken();



    const expiresAt =
      new Date(
        Date.now() +
        1000 * 60 * 60 * 24
      );




    const updated =
      await this.prisma.pendingUser.update({

        where:{
          id:pending.id,
        },

        data:{

          token,

          expiresAt,

        },

      });




    try{

      await this.mailService.sendVerificationEmail(
        updated.email,
        updated.token,
      );


    }catch(error){


      this.logger.error(
        'Verification resend failed',
        error,
      );


      throw new ServiceUnavailableException(
        'Unable to send verification email. Please try again later.',
      );


    }



    return {

      message:
      'A verification email has been sent. Please check your inbox.',

    };


  }





  // =====================================
  // LOGIN
  // =====================================

  async login(dto:LoginDto){


    const user =
      await this.prisma.user.findUnique({

        where:{
          email:dto.email,
        },

      });



    if(!user){

      throw new UnauthorizedException(
        'Invalid credentials',
      );

    }



    const match =
      await bcrypt.compare(
        dto.password,
        user.password,
      );



    if(!match){

      throw new UnauthorizedException(
        'Invalid credentials',
      );

    }



    return this.createToken(
      user.id,
      user.email,
    );

  }





  // =====================================
  // TOKEN GENERATOR
  // =====================================

  private generateVerificationToken(){

    return crypto
      .randomBytes(32)
      .toString('hex');

  }




  // =====================================
  // JWT
  // =====================================

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