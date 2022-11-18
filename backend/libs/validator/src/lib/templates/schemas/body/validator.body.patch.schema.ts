export const updateValidatorBodySchema = {
  type: 'object',
  required: ['isHidden', 'input', 'expected'],
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
      required: ['stdout'],
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
      required: ['stdin'],
      properties: {
        stdin: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'The input stdin of the validator.',
        },
      },
      description: 'The input sent.',
    },
  },
};
