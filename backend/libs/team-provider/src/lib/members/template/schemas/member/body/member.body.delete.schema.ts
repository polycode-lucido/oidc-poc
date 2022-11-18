export const deleteTeamMemberBodySchema = {
  type: 'object',
  required: ['userId'],
  properties: {
    userId: {
      type: 'string',
      format: 'uuid',
      description: 'The id of the user to add to the team',
    },
  },
};
