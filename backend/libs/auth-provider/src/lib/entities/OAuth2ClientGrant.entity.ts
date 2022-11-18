import { BelongsTo, ForeignKey } from 'sequelize-typescript';
import { OAuth2Client } from './OAuth2Client.entity';
import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

export enum OAuth2ClientGrant {
  AUTHORIZATION_CODE = 'authorization_code',
  CLIENT_CREDENTIALS = 'client_credentials',
  REFRESH_TOKEN = 'refresh_token',
  PASSWORD = 'password',
  IMPLICIT = 'implicit',
}

@Table({
  tableName: 'auth_oauth2_client_grants',
  freezeTableName: true,
})
export class OAuth2ClientGrants extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.ENUM({
      values: Object.values(OAuth2ClientGrant),
    }),
  })
  grant: OAuth2ClientGrants;

  @BelongsTo(() => OAuth2Client, 'client_id')
  client: OAuth2Client;

  @ForeignKey(() => OAuth2Client)
  @Column({
    type: DataType.UUID,
    field: 'client_id',
  })
  clientId: string;
}
