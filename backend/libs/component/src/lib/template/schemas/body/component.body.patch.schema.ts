import { ComponentType } from '@polycode/shared';
import { createComponentDataBodySchema } from './component.body.create.schema';

export const patchComponentBodySchema = {
  type: 'object',
  required: ['type', 'orientation', 'data'],
  properties: {
    id: {
      type: 'string',
      description: 'The component uuid',
    },
    type: {
      type: 'string',
      enum: Object.values(ComponentType),
      description:
        'The type of the component. Can be "container", "editor", "quizz" or "markdown"',
    },
    data: {
      ...createComponentDataBodySchema,
    },
  },
};
