import { Test, TestingModule } from '@nestjs/testing';

import { SendEmailUseCase } from '@core/modules/notifications/applications/use-cases/send-email.use-case';
import { SendSMSUseCase } from '@core/modules/notifications/applications/use-cases/send-sms.use-case';
import { RmqContext } from '@nestjs/microservices';
import { SMSNotificationConsumer } from '@adapters/drivers/rmq/consumers/notification.consumer';

describe('SMSNotificationConsumer', () => {
  let consumer: SMSNotificationConsumer;
  let mockSendSMSUseCase: jest.Mocked<SendSMSUseCase>;
  let mockSendEmailUseCase: jest.Mocked<SendEmailUseCase>;
  let mockContext: jest.Mocked<RmqContext>;

  beforeEach(async () => {
    mockSendSMSUseCase = {
      execute: jest.fn(),
    } as any;

    mockSendEmailUseCase = {
      execute: jest.fn(),
    } as any;

    mockContext = {
      getChannelRef: jest.fn().mockReturnValue({
        ack: jest.fn(),
      }),
      getMessage: jest.fn().mockReturnValue({}),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SMSNotificationConsumer],
      providers: [
        { provide: SendEmailUseCase, useValue: mockSendEmailUseCase },
        { provide: SendSMSUseCase, useValue: mockSendSMSUseCase },
      ],
    }).compile();

    consumer = module.get<SMSNotificationConsumer>(SMSNotificationConsumer);
  });

  describe('handelSMSNotification', () => {
    it('should handle SMS notifications successfully', async () => {
      const smsPayload = { message: 'Test message', phone: '123456789' };

      await consumer.handelSMSNotification(smsPayload, mockContext);

      expect(mockSendSMSUseCase.execute).toHaveBeenCalledWith(smsPayload);
      expect(mockContext.getChannelRef().ack).toHaveBeenCalledWith(
        mockContext.getMessage(),
      );
    });

    it('should throw an error if SMS notification fails', async () => {
      const smsPayload = { message: 'Test message', phone: '123456789' };
      mockSendSMSUseCase.execute.mockRejectedValue(new Error('SMS Error'));

      await expect(
        consumer.handelSMSNotification(smsPayload, mockContext),
      ).rejects.toThrow('SMS Error');

      expect(mockSendSMSUseCase.execute).toHaveBeenCalledWith(smsPayload);
      expect(mockContext.getChannelRef().ack).not.toHaveBeenCalled();
    });
  });

  describe('handelEmailNotification', () => {
    it('should handle email notifications successfully', async () => {
      const emailPayload = {
        html: '<p>Test</p>',
        subject: 'Test Subject',
        text: 'Test Text',
        to: 'test@example.com',
      };

      await consumer.handelEmailNotification(emailPayload, mockContext);

      expect(mockSendEmailUseCase.execute).toHaveBeenCalledWith(emailPayload);
      expect(mockContext.getChannelRef().ack).toHaveBeenCalledWith(
        mockContext.getMessage(),
      );
    });

    it('should throw an error if email notification fails', async () => {
      const emailPayload = {
        html: '<p>Test</p>',
        subject: 'Test Subject',
        text: 'Test Text',
        to: 'test@example.com',
      };
      mockSendEmailUseCase.execute.mockRejectedValue(new Error('Email Error'));

      await expect(
        consumer.handelEmailNotification(emailPayload, mockContext),
      ).rejects.toThrow('Email Error');

      expect(mockSendEmailUseCase.execute).toHaveBeenCalledWith(emailPayload);
      expect(mockContext.getChannelRef().ack).not.toHaveBeenCalled();
    });
  });
});
