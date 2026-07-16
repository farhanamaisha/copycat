import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';

import { Resend } from 'resend';


@Injectable()
export class MailService {

  private readonly logger =
    new Logger(MailService.name);


  private readonly resend: Resend;

constructor() {

  const apiKey =
    process.env.RESEND_API_KEY;


  if (!apiKey) {

    throw new Error(
      "RESEND_API_KEY is missing"
    );

  }


  this.resend =
    new Resend(apiKey);

}




  async sendVerificationEmail(
    email:string,
    token:string,
  ){


    const verificationUrl =
      `${process.env.BACKEND_URL}/auth/verify-email/${token}`;



    try{


      const {
        data,
        error,
      } =
      await this.resend.emails.send({


       from: 'Copy-Cat <noreply@copycatapp.me>',


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


        text:
        `Verify your email by visiting:\n\n${verificationUrl}\n\nThis link expires in 24 hours.`,

      });




      if(error){

        this.logger.error(
          `Failed sending verification email to ${email}`,
          error,
        );

        throw new ServiceUnavailableException(
          'Unable to send verification email.',
        );

      }




      this.logger.log(
        `Verification email sent to ${email}. Email ID: ${data?.id}`,
      );


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