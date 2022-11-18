import { Action, ResourceName } from '@polycode/casl';
import { AuthorizeDecoratorOptions } from '@polycode/auth-consumer';
import { SubjectType } from '@polycode/auth-provider';

/*
 * Check if the user is authorized to read his/herself user emails.
 */
export const UserEmailReadSelfAuthorization: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Read,
      resource: ResourceName.USER_EMAIL,
      attributes: {
        user_id: '@Param::userId',
      },
    },
  ],
};

/*
 * Check if the user is authorized to create his/herself user emails.
 */
export const UserEmailCreateSelfAuthorization: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Create,
      resource: ResourceName.USER_EMAIL,
      attributes: {
        user_id: '@Param::userId',
      },
    },
  ],
};

/*
 * Check if the user is authorized to delete his/herself user emails.
 */
export const UserEmailDeleteSelfAuthorize: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Delete,
      resource: ResourceName.USER_EMAIL,
      attributes: {
        user_id: '@Param::userId',
      },
    },
  ],
};
