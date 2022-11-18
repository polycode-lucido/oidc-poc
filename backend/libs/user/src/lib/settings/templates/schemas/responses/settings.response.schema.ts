import { PreferredLanguage } from '@polycode/shared';

export const settingsResponseSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'The uuid of the settings',
    },
    userId: {
      type: 'string',
      format: 'uuid',
      description: 'The uuid of the corresponding user',
    },
    preferredEditingLanguage: {
      type: 'string',
      description:
        'The programming language that will be used by default for this user.',
      default: 'javascript',
      example: 'python',
    },
    preferredLanguage: {
      type: 'enum',
      enum: Object.values(PreferredLanguage),
      description:
        'The human language that will be used by default for this user.',
      example: PreferredLanguage.FRENCH,
      default: PreferredLanguage.ENGLISH,
    },
  },
};
