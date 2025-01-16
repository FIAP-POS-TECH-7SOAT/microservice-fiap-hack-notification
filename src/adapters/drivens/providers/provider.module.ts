import { Module } from '@nestjs/common';
import { BraveEmailProvider } from './brave-email.provider';

import { EnvService } from '../infra/envs/env.service';

import { EmailProvider } from '@core/modules/notifications/applications/ports/providers/email.provider';
import { SMSProvider } from '@core/modules/notifications/applications/ports/providers/sms.provider';
import { TwilioSMSProvider } from './twilio-sms.provider';

@Module({
  providers: [
    {
      provide: EmailProvider,
      useClass: BraveEmailProvider,
    },
    {
      provide: SMSProvider,
      useClass: TwilioSMSProvider,
    },

    EnvService,
  ],

  exports: [EmailProvider, SMSProvider],
})
export class ProviderModule {}
