export const validatorResponseSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'uuid',
      description: 'The validator id',
    },
    isHidden: {
      type: 'boolean',
      description: 'Whether the validator is hidden or not.',
    },
    expected: {
      type: 'object',
      properties: {
        stdout: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'The expected stdout output of the validator.',
        },
      },
      description: 'The expected output of the validator.',
    },
    input: {
      type: 'object',
      properties: {
        stdout: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'The stdin input of the validator.',
        },
      },
      description: 'The input sent.',
    },
  },
};
