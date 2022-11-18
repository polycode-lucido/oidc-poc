import { ItemType } from '@polycode/shared';

export const createBodySchema = {
  type: 'object',
  required: ['cost', 'type', 'data'],
  properties: {
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
