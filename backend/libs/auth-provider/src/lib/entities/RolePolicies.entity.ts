import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Role } from './Role.entity';
import { Action, ResourceName } from '@polycode/casl';

@Table({
  tableName: 'auth_role_policies',
  freezeTableName: true,
})
export class RolePolicies extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @Column({
    allowNull: false,
    type: DataType.ENUM({
      values: Object.values(Action),
    }),
  })
  action: Action;

  @Column({
    allowNull: false,
    type: DataType.ENUM({
      values: Object.values(ResourceName),
    }),
  })
  resource: ResourceName;

  @Column({
    type: DataType.JSON,
  })
  attributes: Record<string, unknown>;

  @BelongsTo(() => Role, 'role_id')
  role: Role;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.UUID,
    field: 'role_id',
  })
  roleId: string;
}
