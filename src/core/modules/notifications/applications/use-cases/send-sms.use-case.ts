import { Injectable } from '@nestjs/common';
import { Either, right } from '@core/common/entities/either';

import { SMSProvider } from '../ports/providers/sms.provider';

interface RequestProps {
  message: string;
  phone: string;
}
type ResponseProps = Either<
  void,
  {
    ok: boolean;
  }
>;
@Injectable()
export class SendSMSUseCase {
  constructor(private readonly smsProvider: SMSProvider) {}
  async execute({ message, phone }: RequestProps): Promise<ResponseProps> {
    await this.smsProvider.send({
      message,
      phone,
    });
    return right({ ok: true });
  }
}
