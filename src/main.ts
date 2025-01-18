import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { EnvService } from '@adapters/drivens/infra/envs/env.service';

import { MicroserviceOptions, Transport } from '@nestjs/microservices';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const envService = app.get(EnvService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [envService.get('AMQP_URL')],
      queue: envService.get<any>('AMQP_QUEUES').NOTIFICATION_QUEUE.name,
      noAck: false,
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();
}
bootstrap();
