import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';


import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';

import { JwtAuthGuard } from './guards/jwt-auth.guard';



@Controller('auth')
export class AuthController {


  constructor(
    private authService: AuthService,
  ) {}



  // =========================
  // REGISTER
  // =========================

  @Post('register')
  register(
    @Body() dto:RegisterDto,
  ){

    return this.authService.register(dto);

  }




  // =========================
  // VERIFY EMAIL
  // =========================

  @Get('verify-email/:token')
  verifyEmail(
    @Param('token') token:string,
  ){

    return this.authService.verifyEmail(token);

  }




  // =========================
  // RESEND VERIFICATION
  // =========================

  @Post('resend-verification')
  resendVerification(
    @Body() dto:ResendVerificationDto,
  ){

    return this.authService.resendVerification(
      dto.email,
    );

  }





  // =========================
  // LOGIN
  // =========================

  @Post('login')
  login(
    @Body() dto:LoginDto,
  ){

    return this.authService.login(dto);

  }





  // =========================
  // PROFILE
  // =========================

  @UseGuards(JwtAuthGuard)

  @Get('profile')

  profile(
    @Request() req,
  ){

    return {

      message:
      'Protected route works',

      user:req.user,

    };

  }


}