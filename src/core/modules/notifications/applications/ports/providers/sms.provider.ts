export type SMSSendProps = {
  phone: string;
  message: string;
};
export abstract class SMSProvider {
  abstract send(key: SMSSendProps): Promise<boolean>;
}
