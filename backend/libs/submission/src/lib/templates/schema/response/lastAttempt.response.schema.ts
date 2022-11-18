export const lastAttemptResponseSchema = {
  type: 'object',
  properties: {
    lastSuccess: {
      type: 'object',
      properties: {
        at: {
          type: 'string',
          description: 'The date of the last success',
        },
        data: {
          type: 'object',
          properties: {
            language: {
              type: 'string',
              description: 'The used programming language',
            },
            version: {
              type: 'string',
              description:
                'The language or compiler version used to compile the code',
            },
            code: {
              type: 'string',
              description: 'The code',
            },
          },
        },
      },
    },
    lastAttempt: {
      type: 'object',
      properties: {
        at: {
          type: 'string',
          description: 'The date of the last attempt',
        },
        data: {
          type: 'object',
          properties: {
            language: {
              type: 'string',
              description: 'The used programming language',
            },
            version: {
              type: 'string',
              description:
                'The language or compiler version used to compile the code',
            },
            code: {
              type: 'string',
              description: 'The code',
            },
          },
        },
      },
    },
  },
};
