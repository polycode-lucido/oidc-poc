export const createEmailBodySchema = {
  type: 'object',
  required: ['email'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
      description:
        'The email of the user. Must be unique. Must be a valid email address.',
    },
  },
};
