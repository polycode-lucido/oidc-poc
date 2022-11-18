import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Team, TeamMembers } from '../team';

@Table({
  tableName: 'user',
  freezeTableName: true,
})
export class User extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @Column({
    unique: true,
    type: DataType.STRING,
    allowNull: false,
  })
  username: string;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    allowNull: false,
  })
  points: number;

  @BelongsToMany(() => Team, {
    through: () => TeamMembers,
    onDelete: 'CASCADE',
  })
  teams: Team[];
}
