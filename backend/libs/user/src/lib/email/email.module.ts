import { Module, forwardRef } from '@nestjs/common';
// import { AuthConsumerModule } from '@polycode/auth-consumer';
import { MailerConsumerModule } from '@polycode/mailer-consumer';
import { UserEmailController } from './email.controller';
import { UserEmailService } from './email.service';
import { UserModule } from '../user.module';

@Module({
  imports: [MailerConsumerModule.forRoot({}), forwardRef(() => UserModule)],
  controllers: [UserEmailController],
  providers: [UserEmailService],
  exports: [UserEmailService],
})
export class UserEmailModule {}
