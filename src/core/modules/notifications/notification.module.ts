import { Module } from '@nestjs/common';

import { SendEmailUseCase } from './applications/use-cases/send-email.use-case';
import { SendSMSUseCase } from './applications/use-cases/send-sms.use-case';

@Module({
  imports: [],
  controllers: [],
  providers: [SendEmailUseCase, SendSMSUseCase],
  exports: [SendEmailUseCase, SendSMSUseCase],
})
export class NotificationsModule {}
