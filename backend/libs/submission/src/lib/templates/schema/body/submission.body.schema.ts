export const submissionBodySchema = {
  type: 'object',
  required: ['language', 'code', 'componentId'],
  properties: {
    componentId: {
      type: 'string',
      description: 'The uuid of the component',
    },
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
