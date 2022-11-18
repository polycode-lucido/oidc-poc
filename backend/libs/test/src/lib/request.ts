import { Request } from 'express';
import { defaults } from 'lodash';

declare module 'express' {
  interface Request {
    authorization?: {
      subject?: {
        id: string;
        internalIdentifier?: string;
      };
    };
  }
}

export const DEFAULT_SUBJECT_ID = '7f73f210-ccb9-4c22-8d00-8752f4d686f0';
export const DEFAULT_SUBJECT_INTERNAL_IDENTIFIER =
  'fc91a211-ba0e-40fc-ad1e-acc1627f2794';
export const DEFAULT_SUBJECT_TYPE = 'user';

export interface CreateFakeRequestOptions {
  params?: Record<string, string>;
  authorization?: {
    subject?: Record<string, string>;
  };
  defaultAuthorization?: boolean;
}

/**
 * It creates a fake request object that can be used in tests
 * @param {CreateFakeRequestOptions} options - CreateFakeRequestOptions = {}
 * @returns A function that takes in an object and returns a request object.
 */
export const createFakeRequest = (
  options: CreateFakeRequestOptions = {}
): Request => {
  options = defaults(options, {
    params: {},
    authorization: {},
    defaultAuthorization: true,
  });

  if (options.defaultAuthorization) {
    options.authorization = {
      ...options.authorization,
      subject: {
        ...options.authorization?.subject,
        id: DEFAULT_SUBJECT_ID,
        internalIdentifier: DEFAULT_SUBJECT_INTERNAL_IDENTIFIER,
        type: DEFAULT_SUBJECT_TYPE,
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const request: any = {
    params: {
      ...options.params,
    },
    authorization: {
      ...options.authorization,
    },
  };

  return request;
};
