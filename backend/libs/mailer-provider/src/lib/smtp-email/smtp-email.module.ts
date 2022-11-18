import { Module } from '@nestjs/common';
import { SMTPEmailService as SMTPEmailService } from './smtp-email.service';

@Module({
  providers: [SMTPEmailService],
  exports: [SMTPEmailService],
})
export class SMTPEmailModule {}
