import {
  createFakeRequest,
  DEFAULT_SUBJECT_ID,
  DEFAULT_SUBJECT_INTERNAL_IDENTIFIER,
  DEFAULT_SUBJECT_TYPE,
} from './request';

describe('createFakeRequest unit tests', () => {
  describe('should return the correct value', () => {
    it('with default value', () => {
      const request = createFakeRequest();

      expect(request.params).toEqual({});
      expect(request.authorization).toEqual({
        subject: {
          id: DEFAULT_SUBJECT_ID,
          internalIdentifier: DEFAULT_SUBJECT_INTERNAL_IDENTIFIER,
          type: DEFAULT_SUBJECT_TYPE,
        },
      });
    });

    it('with custom params', () => {
      const request = createFakeRequest({
        params: {
          foo: 'bar',
        },
      });

      expect(request.params).toEqual({
        foo: 'bar',
      });
    });

    it('with custom authorization', () => {
      const request = createFakeRequest({
        authorization: {
          subject: {
            internalIdentifier: 'foo',
          },
        },
        defaultAuthorization: false,
      });

      expect(request.authorization).toEqual({
        subject: {
          internalIdentifier: 'foo',
        },
      });
    });

    it('without default authorization', () => {
      const request = createFakeRequest({
        defaultAuthorization: false,
      });

      expect(request.authorization).toEqual({});
    });
  });
});
