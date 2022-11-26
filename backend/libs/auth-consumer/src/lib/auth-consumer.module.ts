import { Module } from '@nestjs/common';
//import { AuthProviderModule } from '@polycode/auth-provider';
import { AuthConsumerService } from './auth-consumer.service';

@Module({
  imports: [], //AuthProviderModule],
  controllers: [],
  providers: [AuthConsumerService],
  exports: [AuthConsumerService],
})
export class AuthConsumerModule {}
