export const buyResponseSchema = {
  type: 'object',
  required: ['id', 'cost', 'type', 'data'],
  properties: {
    id: {
      type: 'string',
      description: 'The uuid of the item',
    },
    cost: {
      type: 'integer',
      description: 'The access cost of the item',
    },
    type: {
      type: 'string',
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
