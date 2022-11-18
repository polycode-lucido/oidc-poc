import { Action, ResourceName } from '@polycode/casl';
import { AuthorizeDecoratorOptions } from '@polycode/auth-consumer';
import { SubjectType } from '@polycode/auth-provider';

/*
 * Check if the user is authorized to read all users.
 */
export const UserReadAllAuthorization: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Read,
      resource: ResourceName.USER,
    },
  ],
};

/*
 * Check if the user is authorized to read his/her own user.
 */
export const UserReadSelfAuthorize: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Read,
      resource: ResourceName.USER,
      attributes: {
        id: '@Param::userId',
      },
    },
  ],
};

/*
 * Check if the user is authorized to read and update his/her own user.
 */
export const UserReadUpdateSelfAuthorize: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Read,
      resource: ResourceName.USER,
      attributes: {
        id: '@Param::userId',
      },
    },
    {
      action: Action.Update,
      resource: ResourceName.USER,
      attributes: {
        id: '@Param::userId',
      },
    },
  ],
};

/*
 * Check if the user is authorized to delete his/her own user.
 */
export const UserDeleteSelfAuthorize: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Delete,
      resource: ResourceName.USER,
      attributes: {
        id: '@Param::userId',
      },
    },
  ],
};
