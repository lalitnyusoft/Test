import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
require('dotenv').config();
const { SMTP_FROM_EMAIL } = process.env;

@Injectable()
export class MailServiceService {
  constructor(private readonly mailerService: MailerService) {}
  public async sendMail(
    to: string,
    subject: string,
    html: string,
  ): Promise<any> {
    //console.log('+++++++++ sendMail to ' + to);
    try {
      const sent = await this.mailerService.sendMail({
        to,
        from: `GMX <${SMTP_FROM_EMAIL}>`, // sender address
        subject,
        html, // HTML body content
      });
      console.log({ sent });
    } catch (error) {
      console.log({ error });
    }
  }
}
