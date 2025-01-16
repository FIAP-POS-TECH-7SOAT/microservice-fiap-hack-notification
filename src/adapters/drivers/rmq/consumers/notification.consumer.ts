import { Controller } from '@nestjs/common';
import { Payload, Ctx, RmqContext, EventPattern } from '@nestjs/microservices';
import { SendSMSDTO } from './dtos/send-sms.dto';
import { SendEmailUseCase } from '@core/modules/notifications/applications/use-cases/send-email.use-case';
import { SendSMSUseCase } from '@core/modules/notifications/applications/use-cases/send-sms.use-case';
import { SendEMailDTO } from './dtos/send-email.dto';

@Controller()
export class SMSNotificationConsumer {
  constructor(
    private readonly sendEmailUseCase: SendEmailUseCase,
    private readonly sendSMSUseCase: SendSMSUseCase,
  ) {}

  @EventPattern('notification:sms')
  async handelSMSNotification(
    @Payload() { message, phone }: SendSMSDTO,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      await this.sendSMSUseCase.execute({
        message,
        phone,
      });

      channel.ack(originalMsg);
    } catch (error) {
      console.log('Error', error);

      throw error;

      // TODO: Deve lancar um erro apropriado
    }
  }
  @EventPattern('notification:email')
  async handelEmailNotification(
    @Payload() { html, subject, text, to }: SendEMailDTO,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      await this.sendEmailUseCase.execute({
        html,
        subject,
        text,
        to,
      });
      channel.ack(originalMsg);
    } catch (error) {
      console.log('Error', error);

      throw error;

      // TODO: Deve lancar um erro apropriado
    }
  }
}
