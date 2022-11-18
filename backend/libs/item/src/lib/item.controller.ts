import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ApiRouteAuthenticated } from '@polycode/docs';

import { ItemService } from './item.service';
import CreateItemDTO from './templates/dtos/create-item.dto';
import { Item, ItemType, Transaction } from '@polycode/shared';
import { createBodySchema } from './templates/schemas/item/body/item.body.create.schema';
import { itemGetResponseSchema } from './templates/schemas/item/response/item.reponse.get.schema';
import { itemIdSchema } from './templates/schemas/item/params/itemId.params.schema';
import { UpdateItemDTO } from './templates/dtos/update-item.dto';
import { buyResponseSchema } from './templates/schemas/item/response/buyItem.reponse.schema';
import { Authorize } from '@polycode/auth-consumer';
import { TransactionsService } from '@polycode/transactions';
import { Subject } from '@polycode/decorator';
import { QueryOptions } from '@polycode/query-manager';
import {
  ItemCreateAuthorization,
  ItemDeleteOneAuthorize,
  ItemReadAllAuthorize,
  ItemReadOneAuthorize,
  ItemReadUpdateOneAuthorize,
} from './templates/policies';

@Controller('item')
@ApiTags('Item')
export class ItemController {
  constructor(
    private itemService: ItemService,
    private transactionService: TransactionsService
  ) {}

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Create an item',
    },
    body: {
      schema: createBodySchema,
    },
    response: {
      status: 201,
      description: 'Returns created item',
      schema: itemGetResponseSchema,
    },
  })
  @Post()
  @Authorize(ItemCreateAuthorization)
  async create(@Body() item: CreateItemDTO) {
    return this.itemService.format(await this.itemService.create(item));
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Get all items',
    },
    response: {
      status: 200,
      description: 'Returns an array of items',
      schema: {
        type: 'array',
        items: itemGetResponseSchema,
      },
    },
    pagination: true,
    order: {
      enable: true,
      keys: {
        cost: null,
      },
    },
    filter: {
      enable: true,
      keys: {
        type: {
          matching: false,
          values: Object.values(ItemType),
        },
      },
    },
  })
  @Get()
  @Authorize(ItemReadAllAuthorize)
  async findAll(@Req() request: QueryOptions) {
    const filter = {
      ...Object.keys(request?.filter?.keys || []).reduce(
        (acc, key) => ({
          ...acc,
          [key]: {
            ...(request?.filter?.keys[key].matching
              ? {
                  $regex: request?.filter?.keys[key].value,
                }
              : {
                  $eq: request?.filter?.keys[key].value,
                }),
          },
        }),
        {}
      ),
      ...Object.keys(request?.filter?.arrays || []).reduce(
        (acc, key) => ({
          ...acc,
          [key]: {
            ...(request?.filter?.arrays[key].containsAll
              ? {
                  $all: request?.filter?.arrays[key].value
                    .slice(1, -1)
                    .split(','),
                }
              : {
                  $in: request?.filter?.arrays[key].value
                    .slice(1, -1)
                    .split(','),
                }),
          },
        }),
        {}
      ),
    };

    const items: Item[] = await this.itemService.getAll(
      request?.pagination?.offset,
      request?.pagination?.limit,
      filter,
      request?.order?.keys
    );

    return this.itemService.format(items);
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Get an item by id',
    },
    params: [itemIdSchema],
    response: {
      status: 200,
      description: 'Returns an item',
      schema: itemGetResponseSchema,
    },
    others: [
      ApiNotFoundResponse({
        description: 'Item not found',
      }),
    ],
  })
  @Get(':id')
  @Authorize(ItemReadOneAuthorize)
  async findOne(@Param('id') id: string) {
    return this.itemService.format(await this.itemService.getOne(id));
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Patch an item by id',
    },
    params: [itemIdSchema],
    body: {
      schema: createBodySchema,
    },
    response: {
      status: 200,
      description: 'Returns created item',
      schema: itemGetResponseSchema,
    },
    others: [
      ApiNotFoundResponse({
        description: 'Item not found',
      }),
    ],
  })
  @Patch(':id')
  @Authorize(ItemReadUpdateOneAuthorize)
  async patch(@Param('id') id: string, @Body() patchItem: UpdateItemDTO) {
    return this.itemService.format(await this.itemService.patch(id, patchItem));
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Delete an item by id',
    },
    params: [itemIdSchema],
    response: {
      status: 204,
    },
    others: [
      ApiNotFoundResponse({
        description: 'Item not found',
      }),
    ],
  })
  @Delete(':id')
  @Authorize(ItemDeleteOneAuthorize)
  async delete(@Param('id') id: string) {
    await this.itemService.delete(id);
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Buy an item',
      description:
        "Buy an item, decrement the user's points by the item's cost & returns the item. It wont decrement points if already bought",
    },
    params: [
      {
        name: 'id',
        format: 'uuid',
        description: 'The id of the item',
      },
    ],
    response: {
      status: 201,
      description: 'Returns an array of transactions',
      schema: buyResponseSchema,
    },
    others: [
      ApiNotFoundResponse({
        description: 'Item not found',
      }),
      ApiForbiddenResponse({
        description: 'User has not enough points',
      }),
    ],
  })
  @Post('buy/:id')
  @Authorize()
  async buy(
    @Param('id') id: string,
    @Subject('internalIdentifier') user: string
  ) {
    //checking if the item is already bought
    //we don't want this line to throw a 404 error and stop the controller, so we use _findAll
    const bought: Transaction[] = await this.transactionService._findAll({
      where: {
        userId: user,
        objectId: id,
      },
    });

    const item: Item = await this.itemService.getOne(id);

    //if it was already bought we return it
    if (bought.length > 0) {
      return this.itemService.format(item);
    }

    await this.itemService.buy(id, user);

    return this.itemService.format(item);
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Returns an item',
      description:
        'Returns the item with data if the item was bought, without data otherwise',
    },
    params: [
      {
        name: 'id',
        format: 'uuid',
        description: 'The id of the item',
      },
    ],
    response: {
      status: 200,
      description: 'Returns the item',
    },
  })
  @Get('bought/:id')
  @Authorize()
  async wasBought(
    @Param('id') id: string,
    @Subject('internalIdentifier') user: string
  ) {
    //checking if the item is already bought
    //we don't want this line to throw a 404 error and stop the controller, so we use _findAll
    const bought: Transaction[] = await this.transactionService._findAll({
      where: {
        userId: user,
        objectId: id,
      },
    });

    const item: Item = await this.itemService.getOne(id);

    //if it was already bought we return it
    if (bought.length <= 0) {
      item.data = null;
    }
    return this.itemService.format(item);
  }
}
