import { TeamMemberRole } from '@polycode/shared';

export const teamResponseSchema = {
  type: 'object',
  required: ['name', 'description'],
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'The uuid of the team',
    },
    name: {
      type: 'string',
      description:
        'The name of the team. Must be unique. Must be at least 3 characters long. Must be less than 20 characters long.',
    },
    description: {
      type: 'string',
      description:
        'The description of the team. Must be less than 255 characters long.',
    },
    members: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'name', 'role'],
        properties: {
          id: {
            type: 'string',
            description: 'The id of the user.',
          },
          username: {
            type: 'string',
            description: 'The username of the user.',
          },
          role: {
            type: 'string',
            enum: [...Object.values(TeamMemberRole)],
            description: 'The role of the user.',
          },
        },
      },
    },
  },
};
