import { EnvService } from '@adapters/drivens/infra/envs/env.service';
import { TwilioSMSProvider } from '@adapters/drivens/providers/twilio-sms.provider';
import { Test, TestingModule } from '@nestjs/testing';

import * as twilio from 'twilio';

jest.mock('twilio');

describe('TwilioSMSProvider', () => {
  let twilioSMSProvider: TwilioSMSProvider;
  let mockEnvService: Partial<EnvService>;
  let mockCreate: jest.Mock;

  beforeEach(async () => {
    // Mock do método `create` do cliente Twilio
    mockCreate = jest.fn();

    // Mock do cliente Twilio
    (twilio as unknown as jest.Mock).mockReturnValue({
      messages: {
        create: mockCreate,
      },
    });

    // Mock do EnvService
    mockEnvService = {
      get: jest.fn((key: string) => {
        const envVars = {
          TWILIO_ACCOUNT_SID: 'testAccountSid',
          TWILIO_AUTH_TOKEN: 'testAuthToken',
          TWILIO_PHONE_NUMBER: '+123456789',
        };
        return envVars[key];
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TwilioSMSProvider,
        { provide: EnvService, useValue: mockEnvService },
      ],
    }).compile();

    twilioSMSProvider = module.get<TwilioSMSProvider>(TwilioSMSProvider);
  });

  it('should be defined', () => {
    expect(twilioSMSProvider).toBeDefined();
  });

  it('should send an SMS successfully', async () => {
    const smsProps = {
      message: 'Test message',
      phone: '(555) 123-4567',
    };

    mockCreate.mockResolvedValue({ sid: 'testSid' }); // Simula sucesso no envio de SMS

    const result = await twilioSMSProvider.send(smsProps);

    expect(result).toBe(true);
    expect(mockCreate).toHaveBeenCalledWith({
      from: '+123456789', // Número configurado no EnvService
      to: '5551234567', // Telefone formatado sem caracteres não numéricos
      body: 'Test message', // Mensagem enviada
    });
  });

  it('should throw an error if sending SMS fails', async () => {
    const smsProps = {
      message: 'Test message',
      phone: '(555) 123-4567',
    };

    mockCreate.mockRejectedValue(new Error('Twilio Error')); // Simula falha no envio de SMS

    await expect(twilioSMSProvider.send(smsProps)).rejects.toThrow(
      'Twilio Error',
    );

    expect(mockCreate).toHaveBeenCalledWith({
      from: '+123456789', // Número configurado no EnvService
      to: '5551234567', // Telefone formatado sem caracteres não numéricos
      body: 'Test message', // Mensagem enviada
    });
  });
});
