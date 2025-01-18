import { Injectable } from '@nestjs/common';

import { EnvService } from '../infra/envs/env.service';
import * as nodemailer from 'nodemailer';

import {
  EmailProvider,
  EmailProviderProps,
} from '@core/modules/notifications/applications/ports/providers/email.provider';

@Injectable()
export class BraveEmailProvider implements EmailProvider {
  private transporter: nodemailer.Transporter;
  constructor(private readonly env: EnvService) {
    this.transporter = nodemailer.createTransport({
      host: this.env.get('BRAVE_EMAIL_HOST') as string,
      port: Number(this.env.get('BRAVE_EMAIL_PORT')),
      auth: {
        user: this.env.get('BRAVE_EMAIL_USER'),
        pass: this.env.get('BRAVE_EMAIL_PASS'),
      },
    });
  }
  async send({
    to,
    subject,
    html,
    text,
  }: EmailProviderProps): Promise<boolean> {
    const mailOptions = {
      to,
      from: this.env.get('BRAVE_EMAIL_FROM'),
      subject,
      text,
      html,
    };
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          reject(new Error(error.message));
        } else {
          console.log('Email enviado: ' + info.response);
          resolve(true);
        }
      });
    });
  }
}
