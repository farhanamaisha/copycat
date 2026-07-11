import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';


@Injectable()
export class MailService {


  private transporter =
    nodemailer.createTransport({

      service:'gmail',

      auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
      },

    });



  async sendVerificationEmail(
    email:string,
    token:string,
  ){


    const url =
  `${process.env.BACKEND_URL}/auth/verify-email/${token}`;


    await this.transporter.sendMail({

      from:process.env.EMAIL_USER,

      to:email,

      subject:'Verify your Copy-Cat account',

      html:`

      <h2>Welcome to Copy-Cat</h2>

      <p>Click below to verify your email:</p>

      <a href="${url}">
      Verify Email
      </a>

      `,

    });


  }

}