import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { OAuth2Token } from './OAuth2Token.entity';
import { SubjectCredentials } from './SubjectCredentials.entity';
import { Role } from './Role.entity';
import { SubjectRoles } from './SubjectRoles.entity';

export enum SubjectType {
  USER = 'user',
}

@Table({
  tableName: 'auth_subject',
  freezeTableName: true,
})
export class Subject extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @Column({
    unique: true,
    type: DataType.UUID,
    allowNull: false,
    field: 'internal_identifier',
  })
  internalIdentifier: string;

  @Column({
    type: DataType.ENUM({
      values: Object.values(SubjectType),
    }),
    allowNull: false,
  })
  type: SubjectType;

  @HasOne(() => SubjectCredentials, 'subject_id')
  credentials: SubjectCredentials;

  @HasMany(() => OAuth2Token, 'subject_id')
  tokens: OAuth2Token;

  @BelongsToMany(() => Role, () => SubjectRoles)
  roles: Role[];
}
