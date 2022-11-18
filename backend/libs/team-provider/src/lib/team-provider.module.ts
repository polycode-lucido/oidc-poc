import { Module } from '@nestjs/common';
import { TeamProviderController } from './team-provider.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { TeamProviderService } from './team-provider.service';
import { AuthConsumerModule } from '@polycode/auth-consumer';
import { TeamMembersModule } from './members/members.module';
import { sequelizeTeamModels } from '@polycode/shared';

@Module({
  imports: [
    SequelizeModule.forFeature(sequelizeTeamModels),
    AuthConsumerModule,
    TeamMembersModule,
  ],
  controllers: [TeamProviderController],
  providers: [TeamProviderService],
  exports: [TeamProviderService],
})
export class TeamProviderModule {}
