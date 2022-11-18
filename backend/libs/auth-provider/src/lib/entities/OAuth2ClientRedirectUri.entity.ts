import { IsUrl } from 'class-validator';
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

@Table({
  tableName: 'auth_oauth2_client_redirect_uris',
  freezeTableName: true,
})
export class OAuth2ClientUris extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @IsUrl({
    protocols: ['http', 'https'],
  })
  @Column
  uri: string;

  @BelongsTo(() => OAuth2Client, 'client_id')
  client: OAuth2Client;

  @ForeignKey(() => OAuth2Client)
  @Column({
    type: DataType.UUID,
    field: 'client_id',
  })
  clientId: string;
}
