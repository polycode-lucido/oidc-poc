import { Action, ResourceName } from '@polycode/casl';
import { AuthorizeDecoratorOptions } from '@polycode/auth-consumer';
import { SubjectType } from '@polycode/auth-provider';

/*
 * Check if the user is authorized to read his/herself's settings.
 */
export const UserSettingReadSelfAuthorization: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Read,
      resource: ResourceName.USER_SETTINGS,
      attributes: {
        user_id: '@Param::userId',
      },
    },
  ],
};

/*
 * Check if the user is authorized to delete his/herself's settings.
 */
export const UserSettingUpdateSelfAuthorize: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Read,
      resource: ResourceName.USER_SETTINGS,
      attributes: {
        user_id: '@Param::userId',
      },
    },
    {
      action: Action.Update,
      resource: ResourceName.USER_SETTINGS,
      attributes: {
        user_id: '@Param::userId',
      },
    },
  ],
};
