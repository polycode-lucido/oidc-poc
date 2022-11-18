import { componentResponseSchema } from '@polycode/component';
import { ContentType } from '@polycode/shared';

export const contentResponseSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'The content name',
    },
    description: {
      type: 'string',
      description: 'The content description',
    },
    type: {
      enum: Object.values(ContentType),
      description: 'The content type',
    },
    reward: {
      type: 'number',
      description: 'The content reward',
    },
    rootComponent: {
      ...componentResponseSchema,
    },
    data: {
      type: 'object',
      description: 'The content data',
    },
  },
};
