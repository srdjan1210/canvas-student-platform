import { Announcement } from '../../../domain/courses/announcement';

export type EmailContent = {
  html?: string;
  text?: string;
  subject: string;
  to: string;
};
export interface IEmailService {
  sendAccountCreatedMail(email: string);
  sendAddedToCourseEmail(email: string, course: string);
  sendAnnouncementEmail(emails: string[], announcement: Announcement);
}
