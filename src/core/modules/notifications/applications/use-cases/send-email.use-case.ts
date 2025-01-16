import { Injectable } from '@nestjs/common';
import { Either, right } from '@core/common/entities/either';
import { EmailProvider } from '../ports/providers/email.provider';

interface RequestProps {
  text: string;
  html: string;
  subject: string;
  to: string;
}
type ResponseProps = Either<
  void,
  {
    ok: boolean;
  }
>;
@Injectable()
export class SendEmailUseCase {
  constructor(private readonly emailProvider: EmailProvider) {}
  async execute({
    html,
    text,
    subject,
    to,
  }: RequestProps): Promise<ResponseProps> {
    await this.emailProvider.send({
      html,
      text,
      subject,
      to,
    });

    return right({ ok: true });
  }
}
