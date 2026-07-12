import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';

import * as nodemailer from 'nodemailer';


@Injectable()
export class MailService {

  private readonly logger =
    new Logger(MailService.name);


  private transporter =
  nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 587,

    secure: false,

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },

    tls: {
      rejectUnauthorized: false,
    },

  });




  async sendVerificationEmail(
    email:string,
    token:string,
  ){


    const verificationUrl =
      `${process.env.BACKEND_URL}/auth/verify-email/${token}`;



    try{


      await this.transporter.sendMail({

        from:{

          name:'Copy-Cat',

          address:
          process.env.EMAIL_USER!,

        },


        to:email,


        subject:
        'Verify your Copy-Cat account',



        html:`

        <!DOCTYPE html>

        <html>

        <body>

          <h2>
            Welcome to Copy-Cat
          </h2>


          <p>
            Thanks for creating your account.
          </p>


          <p>
            Please verify your email address:
          </p>


          <a 
          href="${verificationUrl}"
          style="
          display:inline-block;
          padding:12px 20px;
          background:#000;
          color:#fff;
          text-decoration:none;
          border-radius:6px;
          "
          >

          Verify Email

          </a>


          <p>
            This verification link expires in 24 hours.
          </p>


          <p>
            If you did not create this account,
            you can ignore this email.
          </p>


        </body>

        </html>

        `,


      });



    }
    catch(error){


      this.logger.error(
        `Failed sending verification email to ${email}`,
        error,
      );


      throw new ServiceUnavailableException(
        'Unable to send verification email.',
      );


    }


  }


}