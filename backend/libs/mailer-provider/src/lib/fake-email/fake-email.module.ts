import { Module } from '@nestjs/common';
import { FakeEmailService } from './fake-email.service';

@Module({
  providers: [FakeEmailService],
  exports: [FakeEmailService],
})
export class FakeEmailModule {}
