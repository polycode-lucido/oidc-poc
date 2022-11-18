import { createFakeRequest } from '@polycode/test';
import { ParseUUIDOrMePipe } from './validation';
import { DEFAULT_SUBJECT_INTERNAL_IDENTIFIER } from '@polycode/test';
import { BadRequestException } from '@nestjs/common';

describe('ParseUUIDOrMePipe unit tests', () => {
  describe('should return the correct value', () => {
    it('with @me', () => {
      const pipe = new ParseUUIDOrMePipe();
      const request = createFakeRequest({
        params: { id: '@me' },
      });

      const result = pipe.transform(request);

      expect(result).toBe(DEFAULT_SUBJECT_INTERNAL_IDENTIFIER);
    });

    it('with a valid UUID', () => {
      const pipe = new ParseUUIDOrMePipe();
      const request = createFakeRequest({
        params: { id: DEFAULT_SUBJECT_INTERNAL_IDENTIFIER },
      });

      const result = pipe.transform(request);

      expect(result).toBe(DEFAULT_SUBJECT_INTERNAL_IDENTIFIER);
    });

    it('with custom params name', () => {
      const pipe = new ParseUUIDOrMePipe('customParamName');
      const request = createFakeRequest({
        params: { customParamName: '@me' },
      });

      const result = pipe.transform(request);

      expect(result).toBe(DEFAULT_SUBJECT_INTERNAL_IDENTIFIER);
    });
  });

  describe('should throw an error', () => {
    it('with an invalid UUID', () => {
      const pipe = new ParseUUIDOrMePipe();
      const request = createFakeRequest({
        params: { id: 'invalid' },
      });

      expect(() => pipe.transform(request)).toThrow(BadRequestException);
    });

    it('with @me and without authorization', () => {
      const pipe = new ParseUUIDOrMePipe();
      const request = createFakeRequest({
        params: { id: '@me' },
        defaultAuthorization: false,
      });

      expect(() => pipe.transform(request)).toThrow(BadRequestException);
    });
  });
});
