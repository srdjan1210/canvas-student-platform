export type EmailContent = {
  text: string;
  subject: string;
  to: string;
};
export interface IEmailService {
  sendAccountCreatedMail(email: string);
}
