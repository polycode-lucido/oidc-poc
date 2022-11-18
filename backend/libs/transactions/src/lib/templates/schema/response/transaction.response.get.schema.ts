export const getResponseSchema = {
  type: 'object',
  required: ['id', 'object_id'],
  properties: {
    id: {
      type: 'integer',
      description: 'The id of the user',
    },
    object_id: {
      type: 'string',
      description: 'The id of the item',
    },
  },
};
