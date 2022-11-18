import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { registerer, validationSchema } from './runner-consumer.config';
import { RunnerConsumerService } from './runner-consumer.service';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [registerer], validationSchema }),
    HttpModule,
  ],
  controllers: [],
  providers: [RunnerConsumerService],
  exports: [RunnerConsumerService],
})
export class RunnerConsumerModule {}
