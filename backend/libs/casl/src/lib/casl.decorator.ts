import { applyDecorators, SetMetadata } from '@nestjs/common';
import { CASL_DECORATOR_POLICIES } from './casl.constants';
import { Policies } from './casl.types';

export const SetPolicies = (...handlers: Policies) =>
  applyDecorators(SetMetadata(CASL_DECORATOR_POLICIES, handlers));
