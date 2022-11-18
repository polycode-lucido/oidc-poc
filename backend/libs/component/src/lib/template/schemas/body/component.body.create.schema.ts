import { RunnerLanguages } from '@polycode/runner-consumer';
import { createValidatorBodySchema } from '@polycode/validator';
import { ComponentType } from '@polycode/shared';

export const createLanguageBodySchema = {
  type: 'object',
  required: [],
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

export const createEditorSettingsBodySchema = {
  type: 'object',
  required: ['languages'],
  properties: {
    languages: {
      type: 'array',
      description: 'The languages of the component',
      items: {
        ...createLanguageBodySchema,
      },
    },
  },
};

export const createComponentDataBodySchema = {
  type: 'object',
  required: ['components', 'validators', 'editorSettings'],
  properties: {
    components: {
      type: 'array',
      description: 'The components contained in this component',
      items: {
        type: 'object',
      },
    },
    validators: {
      type: 'array',
      description: 'The validators of the component',
      items: {
        ...createValidatorBodySchema,
      },
    },
    editorSettings: {
      ...createEditorSettingsBodySchema,
    },
  },
};

export const createComponentBodySchema = {
  type: 'object',
  required: ['type', 'data'],
  properties: {
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
