export const patchBodySchema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      description:
        'The username of the user. Must be unique. Must be at least 3 characters long.',
    },
    description: {
      type: 'string',
      description: 'The description of the user.',
    },
  },
};
