import { SMSProvider } from '@core/modules/notifications/applications/ports/providers/sms.provider';
import { SendSMSUseCase } from '@core/modules/notifications/applications/use-cases/send-sms.use-case';
import { Test, TestingModule } from '@nestjs/testing';

describe('SendSMSUseCase', () => {
  let sendSMSUseCase: SendSMSUseCase;
  let mockSMSProvider: jest.Mocked<SMSProvider>;

  beforeEach(async () => {
    mockSMSProvider = {
      send: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendSMSUseCase,
        { provide: SMSProvider, useValue: mockSMSProvider },
      ],
    }).compile();

    sendSMSUseCase = module.get<SendSMSUseCase>(SendSMSUseCase);
  });

  it('should send an SMS successfully', async () => {
    const requestPayload = {
      message: 'Test message',
      phone: '+1234567890',
    };

    const result = await sendSMSUseCase.execute(requestPayload);

    expect(mockSMSProvider.send).toHaveBeenCalledWith(requestPayload);
    expect(result.value).toEqual({ ok: true });
  });

  it('should throw an error if SMS sending fails', async () => {
    mockSMSProvider.send.mockRejectedValue(new Error('SMS error'));

    const requestPayload = {
      message: 'Test message',
      phone: '+1234567890',
    };

    await expect(sendSMSUseCase.execute(requestPayload)).rejects.toThrow(
      'SMS error',
    );

    expect(mockSMSProvider.send).toHaveBeenCalledWith(requestPayload);
  });
});
