import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import {
  EmailContent,
  IEmailService,
} from '../../../application/shared/interfaces/email-service.interface';
import * as sendgrid from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';
import {
  ACCOUNT_CREATED_TEXT,
  ACCOUNT_CREATED_SUBJECT,
  SENDGRID_API_KEY,
  SENDGRID_SENDER,
} from './email.constants';
import { Announcement } from '../../../domain/courses/announcement';
@Injectable()
export class SendgridEmailService implements IEmailService {
  constructor(private readonly configService: ConfigService) {
    const apiKey = configService.get(SENDGRID_API_KEY);
    sendgrid.setApiKey(apiKey);
  }

  async sendAccountCreatedMail(email: string) {
    const content: EmailContent = {
      text: ACCOUNT_CREATED_TEXT,
      subject: ACCOUNT_CREATED_SUBJECT,
      to: email,
    };

    await this.sendEmail(content);
  }

  async sendAddedToCourseEmail(email: string, course: string) {
    const content: EmailContent = {
      text: this.addedToCourseText(course),
      subject: this.addedToCourseSubject(course),
      to: email,
    };
    await this.sendEmail(content);
  }

  async sendAnnouncementEmail(emails: string[], announcement: Announcement) {
    await Promise.all(
      emails.map(async (email) => {
        const content: EmailContent = {
          html: announcement.body,
          subject: announcement.title,
          to: email,
        };
        await this.sendEmail(content);
      }),
    );
  }

  private async sendEmail({ text, subject, to, html }: EmailContent) {
    const from = this.configService.get(SENDGRID_SENDER);
    const content: sendgrid.MailDataRequired = {
      from,
      subject,
      to,
      text,
      html,
    };

    await sendgrid.send(content);
  }

  private addedToCourseText(course: string) {
    return `Hello! You have been added to the ${course} course!`;
  }
  private addedToCourseSubject(course: string) {
    return `You've joined ${course}!`;
  }
}
