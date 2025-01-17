import { EnvService } from '@adapters/drivens/infra/envs/env.service';
import { BraveEmailProvider } from '@adapters/drivens/providers/brave-email.provider';
import { Test, TestingModule } from '@nestjs/testing';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn((mailOptions, callback) => {
      // Simula um envio bem-sucedido chamando o callback sem erro
      callback(null, { response: 'Email enviado com sucesso' });
    }),
  })),
}));
describe('BraveEmailProvider', () => {
  let braveEmailProvider: BraveEmailProvider;

  const mockEnvService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockEnvService.get.mockImplementation((key: string) => {
      switch (key) {
        case 'BRAVE_EMAIL_HOST':
          return 'smtp.mailtrap.io';
        case 'BRAVE_EMAIL_PORT':
          return '2525';
        case 'BRAVE_EMAIL_USER':
          return 'user';
        case 'BRAVE_EMAIL_PASS':
          return 'pass';
        default:
          return undefined;
      }
    });
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BraveEmailProvider,
        { provide: EnvService, useValue: mockEnvService },
      ],
    }).compile();

    braveEmailProvider = module.get<BraveEmailProvider>(BraveEmailProvider);
  });

  it('should send an email successfully', async () => {
    const mailOptions = {
      to: 'to@example.com',
      subject: 'Test Subject',
      html: '<p>Test Email</p>',
      text: 'Test Email',
    };

    const result = await braveEmailProvider.send(mailOptions);

    expect(result).toBe(true);

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'user',
        pass: 'pass',
      },
    });
  });

  it('should throw an error if sending email fails', async () => {
    const sendMailMock = jest.fn((mailOptions, callback) => {
      console.log('Mock sobrescrito de sendMail chamado com:', mailOptions);
      callback(new Error('Email delivery failed'), null);
    });

    // Substituindo o comportamento do mock global
    (nodemailer.createTransport as jest.Mock).mockReturnValueOnce({
      sendMail: sendMailMock,
    });

    // Recria a instância de BraveEmailProvider com o mock atualizado
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BraveEmailProvider,
        { provide: EnvService, useValue: mockEnvService },
      ],
    }).compile();

    const braveEmailProvider =
      module.get<BraveEmailProvider>(BraveEmailProvider);

    const mailOptions = {
      to: 'to@example.com',
      subject: 'Test Subject',
      html: '<p>Test Email</p>',
      text: 'Test Email',
    };

    // Teste de rejeição com erro
    await expect(braveEmailProvider.send(mailOptions)).rejects.toThrow(
      'Email delivery failed',
    );

    // Verifique se o mock foi chamado
    expect(sendMailMock).toHaveBeenCalledWith(
      mailOptions,
      expect.any(Function),
    );
  });
});
