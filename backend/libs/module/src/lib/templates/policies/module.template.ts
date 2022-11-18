import { Action, ResourceName } from '@polycode/casl';
import { AuthorizeDecoratorOptions } from '@polycode/auth-consumer';
import { SubjectType } from '@polycode/auth-provider';

/*
 * Check if the user is authorized to create a module.
 */
export const ModuleCreateAuthorization: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Create,
      resource: ResourceName.MODULE,
    },
  ],
};

/*
 * Check if the user is authorized to read a module.
 */
export const ModuleReadOneAuthorization: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Read,
      resource: ResourceName.MODULE,
      attributes: {
        id: '@Param::moduleId',
      },
    },
  ],
};

/*
 * Check if the user is authorized to read all modules.
 */
export const ModuleReadAllAuthorization: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Read,
      resource: ResourceName.MODULE,
    },
  ],
};

/*
 * Check if the user is authorized to read and update a module.
 */
export const ModuleReadUpdateOneAuthorization: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Read,
      resource: ResourceName.MODULE,
      attributes: {
        id: '@Param::moduleId',
      },
    },
    {
      action: Action.Update,
      resource: ResourceName.MODULE,
      attributes: {
        id: '@Param::moduleId',
      },
    },
  ],
};

/*
 * Check if the user is authorized to delete a module.
 */
export const ModuleDeleteOneAuthorization: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Delete,
      resource: ResourceName.MODULE,
      attributes: {
        id: '@Param::moduleId',
      },
    },
  ],
};
