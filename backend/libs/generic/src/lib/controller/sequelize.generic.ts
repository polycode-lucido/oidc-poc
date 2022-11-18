import { Model } from 'sequelize-typescript';
import { GenericController, GenericControllerOptions, GenericRoute } from '.';
import { GenericSequelizeService } from '../service';
import { Request } from 'express';
import { HttpCode } from '@nestjs/common';

/* A generic controller that can be used for any sequelize model. */
export abstract class GenericSequelizeController<
  M extends Model,
  CreateDto,
  UpdateDto
> extends GenericController {
  constructor(
    readonly service: GenericSequelizeService<M>,
    readonly options: GenericControllerOptions = {}
  ) {
    super(service, options);
  }

  @GenericRoute()
  _getAll(request?: Request) {
    return this.service._findAll(null, {
      pagination: request?.pagination,
      order: request?.order,
      filter: request?.filter,
    });
  }

  @GenericRoute()
  async _getAllAndCount(request?: Request) {
    const result = await this.service._findAllAndCount(null, {
      pagination: request?.pagination,
      order: request?.order,
      filter: request?.filter,
    });

    request.pagination.total = result.count;
    return result.data;
  }

  @GenericRoute()
  _create(body: CreateDto) {
    return this.service._create({ ...body });
  }

  @GenericRoute()
  _getById(id: string) {
    return this.service._findById(id);
  }

  @GenericRoute()
  _updateById(id: string, body: UpdateDto) {
    return this.service._updateById(id, body);
  }

  @GenericRoute()
  @HttpCode(204)
  _deleteById(id: string) {
    return this.service._deleteById(id);
  }
}
