import { defaults } from 'lodash';

export interface CreateFakePromiseOptions {
  resolve?: boolean;
  timeout?: number;
  customResolve?: unknown;
  customReject?: unknown;
}

/**
 * It creates a promise that resolves or rejects after a specified timeout
 * @param {CreateFakePromiseOptions} options - CreateFakePromiseOptions = {}
 * @returns A promise that resolves or rejects after a timeout.
 */
export const createFakePromise = (options: CreateFakePromiseOptions = {}) => {
  options = defaults(options, {
    resolve: true,
    timeout: 0,
    customResolve: undefined,
    customReject: new Error(),
  });

  return new Promise((resolve, reject) => {
    if (options.timeout) {
      setTimeout(() => {
        if (options.resolve) {
          resolve(options.customResolve);
        } else {
          reject(options.customReject);
        }
      }, options.timeout);
    } else {
      if (options.resolve) {
        resolve(options.customResolve);
      } else {
        reject(options.customReject);
      }
    }
  });
};
