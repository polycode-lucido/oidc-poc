import { Module } from '@nestjs/common';
import { AuthConsumerModule } from '@polycode/auth-consumer';
import { UserSettingsController } from './settings.controller';
import { UserSettingsService } from './settings.service';

@Module({
  imports: [AuthConsumerModule],
  controllers: [UserSettingsController],
  providers: [UserSettingsService],
  exports: [UserSettingsService],
})
export class UserSettingsModule {}
