export const createTeamMemberBodySchema = {
  type: 'object',
  required: ['userId'],
  properties: {
    userId: {
      type: 'string',
      format: 'uuid',
      description: 'The userId of the user to add to the team',
    },
  },
};
