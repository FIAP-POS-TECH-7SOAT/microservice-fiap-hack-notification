import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { schemaEnv } from '@adapters/drivens/infra/envs/env';
import { EnvModule } from '@adapters/drivens/infra/envs/env.module';

import { ThrottlerModule } from '@nestjs/throttler';
import { ProviderModule } from '@adapters/drivens/providers/provider.module';
import { RMQModule } from '@adapters/drivers/rmq/rmq.module';

@Module({
  imports: [
    EnvModule,

    ConfigModule.forRoot({
      validate: (env) => {
        env.AMQP_QUEUES = JSON.parse(env.AMQP_QUEUES);
        env.AMQP_ROUTING_KEY = JSON.parse(env.AMQP_ROUTING_KEY);
        return schemaEnv.parse(env);
      },
      isGlobal: true,
    }),

    {
      module: ProviderModule,
      global: true,
    },
    RMQModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
  controllers: [],
})
export class AppModule {}
