import { Action, ResourceName } from '@polycode/casl';
import { AuthorizeDecoratorOptions } from '@polycode/auth-consumer';
import { SubjectType } from '@polycode/auth-provider';

/*
 * Check if the user is authorized to create a item.
 */
export const ItemCreateAuthorization: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Create,
      resource: ResourceName.ITEM,
    },
  ],
};

/*
 * Check if the user is authorized to read a item.
 */
export const ItemReadOneAuthorize: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Read,
      resource: ResourceName.ITEM,
      attributes: {
        id: '@Param::itemId',
      },
    },
  ],
};

/*
 * Check if the user is authorized to read all items.
 */
export const ItemReadAllAuthorize: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Read,
      resource: ResourceName.ITEM,
    },
  ],
};

/*
 * Check if the user is authorized to read and update a item.
 */
export const ItemReadUpdateOneAuthorize: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Read,
      resource: ResourceName.ITEM,
      attributes: {
        id: '@Param::itemId',
      },
    },
    {
      action: Action.Update,
      resource: ResourceName.ITEM,
      attributes: {
        id: '@Param::itemId',
      },
    },
  ],
};

/*
 * Check if the user is authorized to delete a item.
 */
export const ItemDeleteOneAuthorize: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Delete,
      resource: ResourceName.ITEM,
      attributes: {
        id: '@Param::itemId',
      },
    },
  ],
};
