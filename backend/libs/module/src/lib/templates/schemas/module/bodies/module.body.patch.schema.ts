export const patchModuleBodySchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description:
        'The name of the module. Must be at least 3 characters long.',
    },
    description: {
      type: 'string',
      description: 'The description of the module. ',
    },
    type: {
      type: 'string',
      description:
        'The type of the module. Can be "challenge", "practice", "certification", "submodule"...',
    },
    reward: {
      type: 'number',
      description: 'The number of points a user win by completing the module',
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'The tags of the module.',
    },
    data: {
      type: 'object',
      description: 'Data that depend on the type of the module.',
    },
    modules: {
      type: 'array',
      items: {
        type: 'string',
        format: 'uuid',
      },
      description: 'UUIDs of the submodules of this module.',
    },
    contents: {
      type: 'array',
      items: {
        type: 'string',
        format: 'uuid',
      },
      description: 'UUIDs of the contents of this module.',
    },
  },
};
