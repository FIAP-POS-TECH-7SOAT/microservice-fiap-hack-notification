import { EmailProvider } from '@core/modules/notifications/applications/ports/providers/email.provider';
import { SendEmailUseCase } from '@core/modules/notifications/applications/use-cases/send-email.use-case';
import { Test, TestingModule } from '@nestjs/testing';

describe('SendEmailUseCase', () => {
  let sendEmailUseCase: SendEmailUseCase;
  let mockEmailProvider: jest.Mocked<EmailProvider>;

  beforeEach(async () => {
    mockEmailProvider = {
      send: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendEmailUseCase,
        { provide: EmailProvider, useValue: mockEmailProvider },
      ],
    }).compile();

    sendEmailUseCase = module.get<SendEmailUseCase>(SendEmailUseCase);
  });

  it('should send an email successfully', async () => {
    const requestPayload = {
      html: '<p>Test Email</p>',
      text: 'Test Email',
      subject: 'Test Subject',
      to: 'test@example.com',
    };

    const result = await sendEmailUseCase.execute(requestPayload);

    expect(mockEmailProvider.send).toHaveBeenCalledWith(requestPayload);
    expect(result.value).toEqual({ ok: true });
  });

  it('should throw an error if email sending fails', async () => {
    mockEmailProvider.send.mockRejectedValue(new Error('Email error'));

    const requestPayload = {
      html: '<p>Test Email</p>',
      text: 'Test Email',
      subject: 'Test Subject',
      to: 'test@example.com',
    };

    await expect(sendEmailUseCase.execute(requestPayload)).rejects.toThrow(
      'Email error',
    );

    expect(mockEmailProvider.send).toHaveBeenCalledWith(requestPayload);
  });
});
