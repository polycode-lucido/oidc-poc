import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { User } from '../user.entity';

@Table({
  tableName: 'user_emails',
  freezeTableName: true,
})
export class UserEmail extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @IsEmail()
  @Column({
    unique: true,
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @ForeignKey(() => User)
  @Column({
    field: 'user_id',
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @BelongsTo(() => User, 'user_id')
  declare user: User;

  @Exclude()
  @Unique
  @Column({
    field: 'verification_token',
  })
  verificationToken: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    field: 'is_verified',
  })
  isVerified: boolean;
}
