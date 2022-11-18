import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from '../user';
import { TeamMembers } from './TeamMembers.entity';

@Table({
  tableName: 'team',
  freezeTableName: true,
})
export class Team extends Model {
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
  name: string;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @BelongsToMany(() => User, {
    through: () => TeamMembers,
    onDelete: 'CASCADE',
  })
  users: User[];
}
