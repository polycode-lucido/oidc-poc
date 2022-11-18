export const submissionOneResponseSchema = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      description: 'Whether the validator was successful.',
    },
    codeResult: {
      type: 'object',
      description: 'Return runner result object',
      properties: {
        stdout: {
          type: 'string',
          description: 'Standard output stream of the code.',
        },
        stderr: {
          type: 'string',
          description:
            'Standard output stream of the code. All errors and warnings are displayed on this stream ',
        },
        exitCode: {
          type: 'boolean',
          description: `The exit code. If 0 indicates that the task was completed successfully.
        If 1 It indicates that the task was interrupted due to an error. `,
        },
      },
    },
  },
};
