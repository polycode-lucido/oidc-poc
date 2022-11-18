import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthConsumerModule } from '@polycode/auth-consumer';
import { UserEmailModule } from './email/email.module';
import { UserSettingsModule } from './settings/settings.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeUserModels } from '@polycode/shared';

@Module({
  imports: [
    SequelizeModule.forFeature(sequelizeUserModels),
    AuthConsumerModule,
    UserEmailModule,
    UserSettingsModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, UserEmailModule],
})
export class UserModule {}
