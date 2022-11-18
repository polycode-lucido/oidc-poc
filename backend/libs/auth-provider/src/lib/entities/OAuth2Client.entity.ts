import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { OAuth2ClientGrants } from './OAuth2ClientGrant.entity';
import { OAuth2ClientUris } from './OAuth2ClientRedirectUri.entity';

@Table({
  tableName: 'auth_oauth2_client',
  freezeTableName: true,
})
export class OAuth2Client extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.TEXT,
  })
  secret: string;

  @HasMany(() => OAuth2ClientGrants, 'client_id')
  grants: OAuth2ClientGrants[];

  @HasMany(() => OAuth2ClientUris, 'client_id')
  redirectUris: OAuth2ClientUris[];

  @HasMany(() => OAuth2ClientUris, 'requested_client_id')
  tokensRequested: OAuth2ClientUris[];
}
