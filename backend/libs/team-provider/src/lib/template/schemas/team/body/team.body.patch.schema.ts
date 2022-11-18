export const patchBodySchema = {
  type: 'object',
  required: [],
  properties: {
    name: {
      type: 'string',
      description:
        'The name of the team. Must be unique. Must be at least 3 characters long. Must be less than 20 characters long.',
    },
    description: {
      type: 'string',
      description:
        'The description of the team. Must be less than 255 characters long.',
    },
  },
};
