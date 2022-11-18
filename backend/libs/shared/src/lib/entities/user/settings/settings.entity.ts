import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from '../user.entity';

export enum PreferredLanguage {
  ENGLISH = 'en',
  FRENCH = 'fr',
}

@Table({
  tableName: 'user_settings',
  freezeTableName: true,
})
export class UserSettings extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    unique: true,
    type: DataType.UUID,
    allowNull: false,
    field: 'user_id',
  })
  userId: string;

  @BelongsTo(() => User, 'user_id')
  declare user: User;

  @Column({
    field: 'preferred_editing_language',
  })
  preferredEditingLanguage: string;

  @Column({
    type: DataType.ENUM({
      values: Object.values(PreferredLanguage),
    }),
    defaultValue: PreferredLanguage.ENGLISH,
    field: 'preferred_language',
  })
  preferredLanguage: PreferredLanguage;
}
