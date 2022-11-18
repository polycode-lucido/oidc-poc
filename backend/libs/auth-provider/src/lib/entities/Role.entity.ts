import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { RolePolicies } from './RolePolicies.entity';
import { Subject } from './Subject.entity';
import { SubjectRoles } from './SubjectRoles.entity';

@Table({
  tableName: 'auth_role',
  freezeTableName: true,
})
export class Role extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @HasMany(() => RolePolicies, {
    foreignKey: 'role_id',
    onDelete: 'CASCADE',
  })
  policies: RolePolicies[];

  @BelongsToMany(() => Subject, {
    through: () => SubjectRoles,
    onDelete: 'CASCADE',
  })
  subjects: Subject[];
}
