import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { SubjectType } from '@polycode/auth-provider';
import { AuthorizationGuard, SubjectTypeGuard } from './auth-consumer.guard';
import { AUTH_CONSUMER_DECORATOR_SUBJECT_TYPES } from './auth-consumer.constants';
import { IRolePolicies } from './interfaces';
import { Operator, SetPolicies } from '@polycode/casl';
import { PolicyGuard } from '@polycode/casl';
import { CASL_DECORATOR_POLICIES_OPERATOR } from '@polycode/casl';

export interface AuthorizeDecoratorOptions {
  subject?: {
    types: SubjectType[];
  };
  policiesOperator?: Operator;
  policies?: IRolePolicies;
}

export function Authorize(options: AuthorizeDecoratorOptions = {}) {
  return applyDecorators(
    SetMetadata(
      AUTH_CONSUMER_DECORATOR_SUBJECT_TYPES,
      options.subject?.types || []
    ),
    SetMetadata(
      CASL_DECORATOR_POLICIES_OPERATOR,
      options.policiesOperator || Operator.AND
    ),
    SetPolicies(...(options.policies || [])),
    UseGuards(AuthorizationGuard, SubjectTypeGuard, PolicyGuard)
  );
}
