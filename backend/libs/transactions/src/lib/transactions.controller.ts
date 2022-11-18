import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request as RequestExpress } from 'express'; //conflicts with Request in @nestjs/common

import { ApiRouteAuthenticated } from '@polycode/docs';
import { GenericSequelizeController, GenericRoute } from '@polycode/generic';

import { Transaction } from '@polycode/shared';
import { TransactionsService } from './transactions.service';
import { getResponseSchema } from './templates/schema/response/transaction.response.get.schema';
import { Authorize } from '@polycode/auth-consumer';
import { TransactionReadAllAuthorize } from './templates/policies';

@Controller('transactions')
@ApiTags('Transactions')
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
  @Authorize(TransactionReadAllAuthorize)
  @GenericRoute()
  async getAll(@Req() request: RequestExpress) {
    return this._getAllAndCount(request);
  }
}
