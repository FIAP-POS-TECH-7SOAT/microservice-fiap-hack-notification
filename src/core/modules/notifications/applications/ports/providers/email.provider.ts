export type EmailProviderProps = {
  to: string;
  subject: string;
  text: string;
  html: string;
};
export abstract class EmailProvider {
  abstract send(data: EmailProviderProps): Promise<void>;
}
