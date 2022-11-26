import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEmailModule } from './email/email.module';
import { UserSettingsModule } from './settings/settings.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeUserModels } from '@polycode/shared';
import { ParseMePipe } from './validation';

@Module({
  imports: [
    SequelizeModule.forFeature(sequelizeUserModels),
    UserEmailModule,
    forwardRef(() => UserSettingsModule),
  ],
  controllers: [UserController],
  providers: [UserService, ParseMePipe],
  exports: [UserService, UserEmailModule, ParseMePipe],
})
export class UserModule {}
