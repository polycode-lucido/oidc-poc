import { Module } from '@nestjs/common';
import { UserModule } from '@polycode/user';
import { TeamMembersService } from './members.service';
import { TeamProviderModule } from '../team-provider.module';
import { forwardRef } from '@nestjs/common';
import { TeamMembersController } from './members.controller';
import { MailerConsumerModule } from '@polycode/mailer-consumer';

@Module({
  imports: [
    MailerConsumerModule.forRoot({}),
    UserModule,
    forwardRef(() => TeamProviderModule),
  ],
  providers: [TeamMembersService],
  controllers: [TeamMembersController],
  exports: [TeamMembersService],
})
export class TeamMembersModule {}
