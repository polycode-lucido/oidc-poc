import { RunnerLanguages } from '@polycode/runner-consumer';
import { ComponentType } from '@polycode/shared';
import { validatorResponseSchema } from '@polycode/validator';

export const languageResponseSchema = {
  type: 'object',
  properties: {
    defaultCode: {
      type: 'string',
      description: 'The default code of the language',
    },
    language: {
      type: 'string',
      enum: Object.values(RunnerLanguages),
      description: 'The language of the code',
    },
    version: {
      type: 'string',
      description: 'The version of the language',
    },
  },
};

export const componentEditorSettingsResponseSchema = {
  type: 'object',
  properties: {
    languages: {
      type: 'array',
      description: 'The languages of the component',
      items: {
        ...languageResponseSchema,
      },
    },
  },
};

export const componentDataResponseSchema = {
  type: 'object',
  properties: {
    components: {
      type: 'array',
      description: 'The components of this component',
      items: {},
    },
    validators: {
      type: 'array',
      description: 'The validators of the component',
      items: {
        ...validatorResponseSchema,
      },
    },
    editorSettings: {
      ...componentEditorSettingsResponseSchema,
    },
  },
};

export const componentResponseSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'The uuid of the component',
    },
    type: {
      type: 'string',
      enum: Object.values(ComponentType),
      description:
        'The type of the component. Can be "container", "editor", "quizz" or "markdown"',
    },
    data: {
      type: 'object',
      description: 'Data that depend on the type of the component.',
    },
  },
};
