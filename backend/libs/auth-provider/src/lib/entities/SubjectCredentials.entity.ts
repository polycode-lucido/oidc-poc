import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Subject } from './Subject.entity';

export enum CredentialsType {
  EMAIL_WITH_PASSWORD = 'email_with_password',
}

@Table({
  tableName: 'auth_subject_credentials',
  freezeTableName: true,
})
export class SubjectCredentials extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.ENUM({
      values: Object.values(CredentialsType),
    }),
    allowNull: false,
  })
  type: CredentialsType;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  identity: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  secret: string;

  @BelongsTo(() => Subject, 'subject_id')
  subject: Subject;

  @ForeignKey(() => Subject)
  @Column({
    type: DataType.UUID,
    field: 'subject_id',
  })
  subjectId: string;
}
