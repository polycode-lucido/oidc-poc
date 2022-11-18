import { Team } from './Team.entity';
import { TeamMembers } from './TeamMembers.entity';

export * from './Team.entity';
export * from './TeamMembers.entity';

export const sequelizeTeamModels = [Team, TeamMembers];
