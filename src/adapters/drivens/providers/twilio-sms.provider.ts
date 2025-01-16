import { Injectable } from '@nestjs/common';

import { EnvService } from '../infra/envs/env.service';

import * as twilio from 'twilio';

import {
  SMSProvider,
  SMSSendProps,
} from '@core/modules/notifications/applications/ports/providers/sms.provider';

@Injectable()
export class TwilioSMSProvider implements SMSProvider {
  private client: twilio.Twilio;
  constructor(private readonly env: EnvService) {
    const accountSid = this.env.get('TWILIO_ACCOUNT_SID');
    const authToken = this.env.get('TWILIO_AUTH_TOKEN');
    this.client = twilio(accountSid, authToken);
  }
  async send({ message, phone }: SMSSendProps): Promise<void> {
    this.client.messages
      .create({
        from: this.env.get('TWILIO_PHONE_NUMBER'),
        to: phone.replace(/\D/g, ''),
        body: message,
      })
      .then((message) => console.log(message.sid));
  }
}
