import { to500, is404, is409 } from './to';
import { createFakePromise } from '@polycode/test';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import to from 'await-to-js';

describe('to500 unit tests', () => {
  describe('should return the correct value', () => {
    it('with a successful promise', async () => {
      const promise = createFakePromise({
        resolve: true,
        customResolve: true,
      });

      const [err, data] = await to(to500(promise));

      if (err) {
        expect(true).toBe(false);
      } else {
        expect(data).toBe(true);
      }
    });
  });

  describe('should throw error', () => {
    it('with rejected promise', async () => {
      const promise = createFakePromise({ resolve: false });
      const [err] = await to(to500(promise));

      if (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
      } else {
        expect(true).toBe(false);
      }
    });
  });
});

describe('is404 unit tests', () => {
  describe('should return the correct value', () => {
    it('with a successful promise and data', async () => {
      const promise = createFakePromise({
        resolve: true,
        customResolve: {},
      });

      const [err, data] = await to(is404(promise));

      if (err) {
        expect(true).toBe(false);
      } else {
        expect(data).toStrictEqual({});
      }
    });
  });

  describe('should throw error', () => {
    it('with rejected promise', async () => {
      const promise = createFakePromise({ resolve: false });

      const [err] = await to(is404(promise));

      if (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
      } else {
        expect(true).toBe(false);
      }
    });

    it('with no returned data', async () => {
      const promise = createFakePromise({ resolve: true });

      const [err] = await to(is404(promise));

      if (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      } else {
        expect(true).toBe(false);
      }
    });
  });
});

describe('is409 unit tests', () => {
  describe('should return the correct value', () => {
    it('with a successful promise and without data', async () => {
      const promise = createFakePromise({
        resolve: true,
      });

      const [err, data] = await to(is409(promise));

      if (err) {
        expect(true).toBe(false);
      } else {
        expect(data).toBeUndefined();
      }
    });
  });

  describe('should throw error', () => {
    it('with rejected promise', async () => {
      const promise = createFakePromise({ resolve: false });

      const [err] = await to(is409(promise));

      if (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
      } else {
        expect(true).toBe(false);
      }
    });

    it('with returned data', async () => {
      const promise = createFakePromise({
        resolve: true,
        customResolve: {},
      });

      const [err] = await to(is409(promise));

      if (err) {
        expect(err).toBeInstanceOf(ConflictException);
      } else {
        expect(true).toBe(false);
      }
    });
  });
});
