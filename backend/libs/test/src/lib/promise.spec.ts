import { createFakePromise } from './promise';

describe('createFakePromise unit tests', () => {
  describe('should create a promise that resolves', () => {
    it('with default options', () => {
      const promise = createFakePromise();

      return promise
        .then(() => {
          expect(true).toBe(true);
        })
        .catch(() => {
          expect(true).toBe(false);
        });
    });

    it('with custom resolve', () => {
      const promise = createFakePromise({
        resolve: true,
        timeout: 0,
        customResolve: 'customResolve',
      });

      return promise
        .then((result) => {
          expect(result).toBe('customResolve');
        })
        .catch(() => {
          expect(true).toBe(false);
        });
    });
  });

  describe('should create a promise that rejects', () => {
    it('with default timeout', () => {
      const promise = createFakePromise({
        resolve: false,
      });

      return promise
        .then(() => {
          expect(true).toBe(false);
        })
        .catch(() => {
          expect(true).toBe(true);
        });
    });

    it('with custom reject', () => {
      const promise = createFakePromise({
        resolve: false,
        customReject: 'customReject',
      });

      return promise
        .then(() => {
          expect(true).toBe(false);
        })
        .catch((result) => {
          expect(result).toBe('customReject');
        });
    });
  });
});
