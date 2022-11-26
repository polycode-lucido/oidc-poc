import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request as RequestExpress } from 'express'; //conflicts with Request in @nestjs/common

import { ApiRouteAuthenticated } from '@polycode/docs';
import { GenericRoute, GenericSequelizeController } from '@polycode/generic';

import { Transaction } from '@polycode/shared';
import { getResponseSchema } from './templates/schema/response/transaction.response.get.schema';
import { TransactionsService } from './transactions.service';
import { Resource, Scopes } from 'nest-keycloak-connect';

@Controller('transactions')
@ApiTags('Transactions')
@Resource('transaction')
export class TransactionsController extends GenericSequelizeController<
  Transaction,
  undefined,
  undefined
> {
  constructor(private transactionsService: TransactionsService) {
    super(transactionsService);
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Get all transactions',
    },
    response: {
      status: 200,
      description: 'Returns an array of transactions',
      schema: {
        type: 'array',
        items: getResponseSchema,
      },
    },
    pagination: true,
  })
  @Get()
  @Scopes('read')
  @GenericRoute()
  async getAll(@Req() request: RequestExpress) {
    return this._getAllAndCount(request);
  }
}
