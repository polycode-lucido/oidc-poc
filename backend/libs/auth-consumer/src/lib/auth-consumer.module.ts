import { Module } from '@nestjs/common';
import { AuthProviderModule } from '@polycode/auth-provider';
import { AuthConsumerService } from './auth-consumer.service';
import { CaslModule } from '@polycode/casl';

@Module({
  imports: [AuthProviderModule, CaslModule],
  controllers: [],
  providers: [AuthConsumerService],
  exports: [AuthConsumerService, CaslModule],
})
export class AuthConsumerModule {}
