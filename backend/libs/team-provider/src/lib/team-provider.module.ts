import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeTeamModels } from '@polycode/shared';
import { TeamMembersModule } from './members/members.module';
import { TeamProviderController } from './team-provider.controller';
import { TeamProviderService } from './team-provider.service';

@Module({
  imports: [SequelizeModule.forFeature(sequelizeTeamModels), TeamMembersModule],
  controllers: [TeamProviderController],
  providers: [TeamProviderService],
  exports: [TeamProviderService],
})
export class TeamProviderModule {}
