import { User } from '../user';
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Team } from './Team.entity';

export enum TeamMemberRole {
  CAPTAIN = 'captain',
  MEMBER = 'member',
}

@Table({
  tableName: 'team_members',
  freezeTableName: true,
})
export class TeamMembers extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.ENUM({
      values: Object.values(TeamMemberRole),
    }),
    allowNull: false,
    defaultValue: TeamMemberRole.MEMBER,
  })
  role: TeamMemberRole;

  @ForeignKey(() => Team)
  @Column({
    type: DataType.UUID,
    field: 'team_id',
  })
  teamId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    field: 'user_id',
  })
  userId: string;
}
