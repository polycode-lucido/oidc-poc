import { PreferredLanguage } from '@polycode/shared';

export const patchSettingsBodySchema = {
  type: 'object',
  properties: {
    preferredEditingLanguage: {
      type: 'string',
      description:
        'The programming language that should be used by default for this user.',
      default: 'javascript',
      example: 'python',
    },
    preferredLanguage: {
      type: 'enum',
      enum: Object.values(PreferredLanguage),
      description:
        'The human language that should be used by default for this user.',
      example: PreferredLanguage.FRENCH,
      default: PreferredLanguage.ENGLISH,
    },
  },
};
