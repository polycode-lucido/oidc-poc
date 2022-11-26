import { forwardRef, Module } from '@nestjs/common';
import { UserSettings } from '@polycode/shared';
import { UserModule } from '../user.module';
import { UserSettingsController } from './settings.controller';
import { UserSettingsService } from './settings.service';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [UserSettingsController],
  providers: [UserSettingsService, UserSettings],
  exports: [UserSettingsService],
})
export class UserSettingsModule {}
