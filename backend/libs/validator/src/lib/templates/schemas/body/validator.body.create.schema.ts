export const createValidatorBodySchema = {
  type: 'object',
  required: ['isHidden', 'input', 'expected'],
  properties: {
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
          description: 'The stdin input of the validator.',
        },
      },
      description: 'The input sent.',
    },
  },
};
