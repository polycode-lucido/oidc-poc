import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Role } from './Role.entity';
import { Subject } from './Subject.entity';

@Table({
  tableName: 'auth_subject_roles',
  freezeTableName: true,
})
export class SubjectRoles extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @ForeignKey(() => Subject)
  @Column({
    type: DataType.UUID,
    field: 'subject_id',
  })
  subjectId: string;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.UUID,
    field: 'role_id',
  })
  roleId: string;
}
