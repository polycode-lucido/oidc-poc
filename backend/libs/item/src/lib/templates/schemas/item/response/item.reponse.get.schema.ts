import { ItemType } from '@polycode/shared';

export const itemGetResponseSchema = {
  type: 'object',
  required: ['id', 'cost', 'type', 'data'],
  properties: {
    id: {
      type: 'string',
      description: 'The uuid of the item',
    },
    cost: {
      type: 'integer',
      description: 'The purchase cost of the item',
    },
    type: {
      type: 'string',
      enum: Object.values(ItemType),
      description: 'The type of the item',
    },
    data: {
      type: 'object',
      description: 'The data of the item',
      properties: {
        text: {
          type: 'string',
          description: 'Any text you would like to store',
        },
      },
    },
  },
};
