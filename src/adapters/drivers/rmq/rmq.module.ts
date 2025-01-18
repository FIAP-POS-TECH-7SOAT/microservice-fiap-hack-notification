import { Module } from '@nestjs/common';

import { EnvService } from '@adapters/drivens/infra/envs/env.service';
import { EnvModule } from '@adapters/drivens/infra/envs/env.module';
import * as amqp from 'amqplib';
import { SMSNotificationConsumer } from './consumers/notification.consumer';
import { SendSMSUseCase } from '@core/modules/notifications/applications/use-cases/send-sms.use-case';
import { SendEmailUseCase } from '@core/modules/notifications/applications/use-cases/send-email.use-case';

@Module({
  imports: [EnvModule],
  providers: [SendEmailUseCase, SendSMSUseCase],
  controllers: [SMSNotificationConsumer],
})
export class RMQModule {
  constructor(private readonly env: EnvService) {
    this.setup();
  }
  private async setup() {
    try {
      const connection = await amqp.connect(this.env.get('AMQP_URL'));
      const channel = await connection.createChannel();
      const exchange = 'amq.direct';
      const queues = this.env.get('AMQP_QUEUES');
      const queuesKey = Object.keys(queues);

      const allPromises: any[] = [];

      queuesKey.forEach((queueKey) => {
        const queue = queues[queueKey].name;
        const routingKeys = queues[queueKey].routing_keys;
        // Declare a exchange do tipo `direct`
        allPromises.push(
          channel.assertExchange(exchange, 'direct', { durable: true }),
        );
        // Declare a fila
        allPromises.push(channel.assertQueue(queue, { durable: false }));
        // Bind da fila à exchange com a routing key
        routingKeys.forEach((routingKey: string) => {
          allPromises.push(channel.bindQueue(queue, exchange, routingKey));
        });
      });
      await Promise.all(allPromises);
      await channel.close();
      await connection.close();
    } catch (error) {
      console.error('Erro ao configurar o RabbitMQ:', error);
    }
  }
}
