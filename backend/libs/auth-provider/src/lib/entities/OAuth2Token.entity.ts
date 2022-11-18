import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { OAuth2Client } from './OAuth2Client.entity';
import { OAuth2ClientGrant } from './OAuth2ClientGrant.entity';
import { Subject } from './Subject.entity';

export enum TokenType {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
}

@Table({
  tableName: 'auth_oauth2_token',
  freezeTableName: true,
})
export class OAuth2Token extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'hashed_token',
  })
  hashedToken: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'token_expire_at',
  })
  tokenExpireAt: Date;

  @Column({
    type: DataType.ENUM({
      values: Object.values(TokenType),
    }),
    allowNull: false,
  })
  type: TokenType;

  @Column({
    type: DataType.ENUM({
      values: Object.values(OAuth2ClientGrant),
    }),
    allowNull: false,
    field: 'grant_with',
  })
  grantWith: OAuth2ClientGrant;

  @BelongsTo(() => OAuth2Client, 'requested_client_id')
  client: OAuth2Client;

  @ForeignKey(() => OAuth2Client)
  @Column({
    type: DataType.UUID,
    field: 'requested_client_id',
  })
  requestedClientId: string;

  @BelongsTo(() => Subject, 'subject_id')
  subject: Subject;

  @ForeignKey(() => Subject)
  @Column({
    type: DataType.UUID,
    field: 'subject_id',
  })
  subjectId: string;
}
