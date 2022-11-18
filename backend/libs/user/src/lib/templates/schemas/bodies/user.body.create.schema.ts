export const createUserBodySchema = {
  type: 'object',
  required: ['username', 'password', 'email'],
  properties: {
    username: {
      type: 'string',
      description:
        'The username of the user. Must be unique. Must be at least 3 characters long.',
    },
    password: {
      type: 'string',
      description:
        'The password of the user. Must be at least 8 characters long.',
    },
    email: {
      type: 'string',
      format: 'email',
      description:
        'The email of the user. Must be unique. Must be a valid email address.',
    },
  },
};
