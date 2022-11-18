export const getTeamsResponseSchema = {
  type: 'array',
  items: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        description: 'The id of the team where the user is member',
      },
    },
  },
};
