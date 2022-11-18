import { Action, Operator, ResourceName } from '@polycode/casl';
import { AuthorizeDecoratorOptions } from '@polycode/auth-consumer';
import { SubjectType } from '@polycode/auth-provider';

/*
 * Check if the user is authorized to add a team member.
 */
export const TeamMemberCreateAuthorize: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Create,
      resource: ResourceName.TEAM_MEMBER,
      attributes: {
        team_id: '@Param::teamId',
      },
    },
  ],
};

/*
 * Check if the user is authorized to remove a team member.
 */
export const TeamMemberDeleteAuthorize: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policiesOperator: Operator.OR,
  policies: [
    /* Check if the user is authorized to delete a team member. */
    {
      action: Action.Delete,
      resource: ResourceName.TEAM_MEMBER,
      attributes: {
        team_id: '@Param::teamId',
      },
    },
    /* Check if user try to leave the team */
    {
      action: Action.Delete,
      resource: ResourceName.TEAM_MEMBER,
      attributes: {
        user_id: '@Body::userId',
      },
    },
  ],
};
