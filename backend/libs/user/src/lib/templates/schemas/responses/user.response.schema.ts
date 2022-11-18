export const userResponseSchema = {
  type: 'object',
  required: ['id', 'username'],
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'The uuid of the user',
    },
    username: {
      type: 'string',
      description: 'The username of the user',
    },
    description: {
      type: 'string',
      description: 'The description of the user',
    },
    points: {
      type: 'number',
      description: 'Total Polypoints of the user',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'The date and time when the user was last updated',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'The date and time when the user was created',
    },
  },
};
