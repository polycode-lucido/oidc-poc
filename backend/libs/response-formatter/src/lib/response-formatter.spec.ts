import { ResponseFormatter } from './response-formatter';

describe('ResponseFormatter.format unit tests', () => {
  describe('should return the correct value', () => {
    it('with array', () => {
      const response = ResponseFormatter.format([{}]);
      expect(response).toStrictEqual({
        metadata: {
          count: 1,
        },
        data: [{}],
      });
    });

    it('with object', () => {
      const response = ResponseFormatter.format({});
      expect(response).toStrictEqual({
        metadata: {
          count: undefined,
        },
        data: {},
      });
    });
  });
});

describe('ResponseFormatter.formatApiResponseOptions unit tests', () => {
  describe('should return the correct value', () => {
    it('with array', () => {
      const response = ResponseFormatter.formatApiResponseOptions({
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'Id of the item',
              },
            },
          },
        },
      });

      expect(response).toStrictEqual({
        schema: {
          type: 'object',
          required: ['metadata', 'data'],
          properties: {
            metadata: {
              type: 'object',
              properties: {
                count: {
                  type: 'number',
                  description: 'Total number of returned items',
                },
              },
            },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'Id of the item',
                  },
                },
              },
            },
          },
        },
      });
    });

    it('with object', () => {
      const response = ResponseFormatter.formatApiResponseOptions({
        schema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Id of the item',
            },
          },
        },
      });

      expect(response).toStrictEqual({
        schema: {
          type: 'object',
          required: ['metadata', 'data'],
          properties: {
            metadata: {
              type: 'object',
              properties: {},
            },
            data: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'Id of the item',
                },
              },
            },
          },
        },
      });
    });
  });
});
