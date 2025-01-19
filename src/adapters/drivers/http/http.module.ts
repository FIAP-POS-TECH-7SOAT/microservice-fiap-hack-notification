import { Module } from '@nestjs/common';

import { InfoController } from './controllers/info-controller';

@Module({
  imports: [],
  controllers: [InfoController],
})
export class HTTPModule {}
