export const submissionOneBodySchema = {
  type: 'object',
  required: ['language', 'code', 'componentId'],
  properties: {
    language: {
      type: 'string',
      description: 'The used programming language',
    },
    code: {
      type: 'string',
      description: 'Code to execute',
    },
  },
};
