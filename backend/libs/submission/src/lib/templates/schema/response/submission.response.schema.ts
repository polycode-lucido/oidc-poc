export const submissionResponseSchema = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      description: 'True if all validator succeeded, else false',
    },
    validators: {
      type: 'object',
      properties: {
        uuid: {
          type: 'string',
          description: 'The uuid of the validator',
        },
        success: {
          type: 'boolean',
          description: 'Validator succeeded',
        },
      },
    },
  },
};
