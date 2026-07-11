import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';

import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { JwtAuthGuard } from './guards/jwt-auth.guard';


@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService,
  ) {}



  @Post('register')
  register(
    @Body() dto: RegisterDto,
  ) {
    return this.authService.register(dto);
  }



  @Get('verify-email/:token')
  verifyEmail(
    @Param('token') token: string,
  ) {

    return this.authService.verifyEmail(token);

  }



  @Post('login')
  login(
    @Body() dto: LoginDto,
  ) {
    return this.authService.login(dto);
  }



  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(
    @Request() req,
  ) {

    return {
      message: 'Protected route works',
      user: req.user,
    };

  }

}