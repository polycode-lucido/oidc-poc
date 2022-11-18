import { patchComponentBodySchema } from '@polycode/component';
import { ContentType } from '@polycode/shared';

export const patchBodySchema = {
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
      ...patchComponentBodySchema,
    },
    data: {
      type: 'object',
      description: 'The content data',
    },
  },
};
