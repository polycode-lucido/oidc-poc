import { Action, ResourceName } from '@polycode/casl';
import { AuthorizeDecoratorOptions } from '@polycode/auth-consumer';
import { SubjectType } from '@polycode/auth-provider';

/*
 * Check if the user is authorized to create a content.
 */
export const ContentCreateAuthorization: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Create,
      resource: ResourceName.CONTENT,
    },
  ],
};

/*
 * Check if the user is authorized to read a content.
 */
export const ContentReadOneAuthorize: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Read,
      resource: ResourceName.CONTENT,
      attributes: {
        id: '@Param::contentId',
      },
    },
  ],
};

/*
 * Check if the user is authorized to read all contents.
 */
export const ContentReadAllAuthorize: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Read,
      resource: ResourceName.CONTENT,
    },
  ],
};

/*
 * Check if the user is authorized to read and update a content.
 */
export const ContentReadUpdateOneAuthorize: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Read,
      resource: ResourceName.CONTENT,
      attributes: {
        id: '@Param::contentId',
      },
    },
    {
      action: Action.Update,
      resource: ResourceName.CONTENT,
      attributes: {
        id: '@Param::contentId',
      },
    },
  ],
};

/*
 * Check if the user is authorized to delete a content.
 */
export const ContentDeleteOneAuthorize: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Delete,
      resource: ResourceName.CONTENT,
      attributes: {
        id: '@Param::contentId',
      },
    },
  ],
};
