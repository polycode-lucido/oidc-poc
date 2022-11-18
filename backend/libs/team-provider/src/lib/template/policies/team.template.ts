import { Action, ResourceName } from '@polycode/casl';
import { AuthorizeDecoratorOptions } from '@polycode/auth-consumer';
import { SubjectType } from '@polycode/auth-provider';

/*
 * Check if the user is authorized to create a team.
 */
export const TeamCreateAuthorization: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Create,
      resource: ResourceName.TEAM,
    },
  ],
};

/*
 * Check if the user is authorized to read a team.
 */
export const TeamReadOneAuthorize: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Read,
      resource: ResourceName.TEAM,
      attributes: {
        id: '@Param::teamId',
      },
    },
  ],
};

/*
 * Check if the user is authorized to read all teams.
 */
export const TeamReadAllAuthorize: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Read,
      resource: ResourceName.TEAM,
    },
  ],
};

/*
 * Check if the user is authorized to read and update a team.
 */
export const TeamReadUpdateOneAuthorize: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Read,
      resource: ResourceName.TEAM,
      attributes: {
        id: '@Param::teamId',
      },
    },
    {
      action: Action.Update,
      resource: ResourceName.TEAM,
      attributes: {
        id: '@Param::teamId',
      },
    },
  ],
};

/*
 * Check if the user is authorized to delete a team.
 */
export const TeamDeleteOneAuthorize: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Delete,
      resource: ResourceName.TEAM,
      attributes: {
        id: '@Param::teamId',
      },
    },
  ],
};
