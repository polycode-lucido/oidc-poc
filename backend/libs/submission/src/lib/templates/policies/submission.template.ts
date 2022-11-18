import { Action, ResourceName } from '@polycode/casl';
import { AuthorizeDecoratorOptions } from '@polycode/auth-consumer';
import { SubjectType } from '@polycode/auth-provider';

/*
 * Check if the user is authorized to create a submission.
 */
export const SubmissionCreateAuthorization: AuthorizeDecoratorOptions = {
  subject: {
    types: [SubjectType.USER],
  },
  policies: [
    {
      action: Action.Create,
      resource: ResourceName.SUBMISSION,
    },
  ],
};
