import { z } from 'zod';

export const schemaEnv = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3000),
  AWS_S3_BUCKET_NAME: z.string(),
  TWILIO_ACCOUNT_SID: z.string(),
  TWILIO_AUTH_TOKEN: z.string(),
  TWILIO_PHONE_NUMBER: z.string(),
  BRAVE_EMAIL_HOST: z.string(),
  BRAVE_EMAIL_PORT: z.string(),
  BRAVE_EMAIL_USER: z.string(),
  BRAVE_EMAIL_PASS: z.string(),
  BRAVE_EMAIL_FROM: z.string(),
  // AMQP_QUEUE: z.string(),
  AMQP_QUEUES: z.object({
    SMS_QUEUE: z.string(),
    EMAIL_QUEUE: z.string(),
  }),
  AMQP_ROUTING_KEY: z.object({
    SMS_QUEUE: z.string(),
    EMAIL_QUEUE: z.string(),
  }),
  AMQP_URL: z.string(),
  // AMQP_ROUTING_KEY: z.string(),
});

export type Env = z.infer<typeof schemaEnv>;
