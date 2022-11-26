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

  @BelongsTo(() => User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  })
  user: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    field: 'user_id',
    allowNull: false,
  })
  userId: string;

  @Exclude()
  @Unique
  @Column({
    field: 'verification_token',
  })
  verificationToken: string;

  @Column({
    type: DataType.BOOLEAN,
    field: 'is_verified',
    defaultValue: false,
    allowNull: false,
  })
  isVerified: boolean;
}
