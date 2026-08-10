import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend | null;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      this.resend = null;
      this.logger.warn(
        'RESEND_API_KEY not set; emails will be logged instead of sent.',
      );
    } else {
      this.resend = new Resend(apiKey);
    }
  }

  async sendVerificationEmail(email: string, token: string) {
    const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verificationUrl = `${frontend}/auth/verify?token=${token}`;

    try {
      if (!this.resend) {
        this.logger.log(`Verification URL for ${email}: ${verificationUrl}`);
        return;
      }

      const { data, error } = await this.resend.emails.send({
        from: 'Copy-Cat <noreply@copycatapp.me>',
        to: email,
        subject: 'Verify your Copy-Cat account',
        html: `<!DOCTYPE html><html><body><h2>Welcome to Copy-Cat</h2><p>Thanks for creating your account.</p><p>Please verify your email address:</p><a href="${verificationUrl}" style="display:inline-block;padding:12px 20px;background:#000;color:#fff;text-decoration:none;border-radius:6px;">Verify Email</a><p>This verification link expires in 24 hours.</p><p>If you did not create this account, you can ignore this email.</p></body></html>`,
        text: `Verify your email by visiting:\n\n${verificationUrl}\n\nThis link expires in 24 hours.`,
      });

      if (error) {
        if (error?.statusCode === 422 || error?.name === 'validation_error') {
          this.logger.warn(
            `Resend validation error for ${email}; logging verification URL instead.`,
          );
          this.logger.log(`Verification URL for ${email}: ${verificationUrl}`);
          return;
        }

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
    } catch (error) {
      const isValidation =
        error?.response?.statusCode === 422 ||
        error?.name === 'validation_error';
      if (isValidation) {
        this.logger.warn(
          `Resend returned validation error for ${email}; logging verification URL.`,
        );
        this.logger.log(`Verification URL for ${email}: ${verificationUrl}`);
        return;
      }

      this.logger.error(`Failed sending verification email to ${email}`, error);
      throw new ServiceUnavailableException(
        'Unable to send verification email.',
      );
    }
  }
}
