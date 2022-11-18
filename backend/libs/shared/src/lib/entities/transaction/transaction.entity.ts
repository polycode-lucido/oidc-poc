import {
  Column,
  IsUUID,
  Model,
  ForeignKey,
  Table,
  BelongsTo,
  PrimaryKey,
  DataType,
} from 'sequelize-typescript';
import { User } from '../user';

@Table({
  tableName: 'transactions',
  freezeTableName: true,
  paranoid: true,
})
export class Transaction extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    field: 'id',
    allowNull: false,
  })
  id: string;

  @IsUUID(4)
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: 'user_id' })
  userId: string;

  @BelongsTo(() => User, {
    targetKey: 'id',
    onDelete: 'CASCADE',
  })
  usr: User;

  @IsUUID(4)
  @Column({ type: DataType.UUID, field: 'Object_id' })
  objectId: string;
}
