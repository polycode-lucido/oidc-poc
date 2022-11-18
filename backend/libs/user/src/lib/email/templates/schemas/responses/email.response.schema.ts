export const emailResponseSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'The uuid of the email',
    },
    userId: {
      type: 'string',
      format: 'uuid',
      description: 'The uuid of the corresponding user',
    },
    email: {
      type: 'string',
      format: 'email',
      description: 'Email address of the user',
    },
    isVerified: {
      type: 'boolean',
      description: 'Allow to know if the email has been verified',
    },
  },
};
