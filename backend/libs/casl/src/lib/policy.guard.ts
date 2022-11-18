import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  CASL_DECORATOR_POLICIES,
  CASL_DECORATOR_POLICIES_OPERATOR,
} from './casl.constants';
import { CaslAbilityFactory } from './casl-ability.factory';
import {
  Operator,
  Policies,
  Policy,
  PolicyHandler,
  SubjectAbility,
} from './casl.types';
import { Request } from 'express';
import { subject } from '@casl/ability';

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory
  ) {}

  /**
   * It gets the policies from the request, creates an ability object from the policies, and then
   * executes the policy handlers
   * @param {ExecutionContext} context - ExecutionContext - The context of the request.
   * @returns A boolean value.
   */
  canActivate(context: ExecutionContext): boolean {
    const policiesFromMetadata =
      this.reflector.get<Policies>(
        CASL_DECORATOR_POLICIES,
        context.getHandler()
      ) || [];
    const policyHandlers = this.computePolicyHandlers(policiesFromMetadata);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request: any = context.switchToHttp().getRequest();

    /* Getting the policies from the request and then creating an ability object from the policies. */
    const policies =
      request.authorization?.roles
        ?.map((role) => [
          ...role.polices.map((policy) => ({
            action: policy.action,
            resource: policy.resource,
            attributes: this.replaceAttributesTemplate(
              policy.attributes || {},
              request
            ),
          })),
        ])
        .reduce((base, next) => base.concat(next), []) || [];

    const policyOperator =
      this.reflector.get<Operator>(
        CASL_DECORATOR_POLICIES_OPERATOR,
        context.getHandler()
      ) || Operator.AND;

    const ability = this.caslAbilityFactory.create(policies);

    if (policyOperator === Operator.OR) {
      return policyHandlers.some((handler) =>
        this.execPolicyHandler(handler, ability, request)
      );
    }

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability, request)
    );
  }

  /**
   * If the handler is a function, call it, otherwise call the handle method on the handler.
   * @param {PolicyHandler} handler - The policy handler that is being executed.
   * @param {SubjectAbility} ability - The ability that is being checked.
   * @param {Request} request - The request object that was passed to the ability check.
   * @returns A boolean value.
   */
  private execPolicyHandler(
    handler: PolicyHandler,
    ability: SubjectAbility,
    request: Request
  ) {
    if (typeof handler === 'function') {
      return handler(ability, request);
    }
    return handler.handle(ability, request);
  }

  /**
   * It takes a list of policies and returns a list of functions that take an ability and a request and
   * return a boolean
   * @param {Policies} policies - Policies - This is the policies object that we defined in the
   * previous section.
   * @returns An array of functions that take an ability and a request and return a boolean.
   */
  private computePolicyHandlers(policies: Policies) {
    return (
      [...policies].map(
        (policyFromMetadata) => (ability: SubjectAbility, request: Request) => {
          // need to be a deep copy of the metadata to not mutate the original
          const policy: Policy = JSON.parse(JSON.stringify(policyFromMetadata));

          for (const attribute of Object.keys(policy.attributes || {})) {
            if (typeof policy.attributes[attribute] !== 'string') {
              continue;
            }

            /* Replacing the policy attributes from templates. */
            const attr: string = policy.attributes[attribute] as string;

            if (attr.startsWith('@Param::')) {
              const paramName = attr.replace('@Param::', '');
              policy.attributes[attribute] = request.params[paramName];
            }

            if (attr.startsWith('@Query::')) {
              const paramName = attr.replace('@Query::', '');
              policy.attributes[attribute] = request.query[paramName];
            }

            if (attr.startsWith('@Header::')) {
              const paramName = attr.replace('@Header::', '');
              policy.attributes[attribute] = request.headers[paramName];
            }

            if (attr.startsWith('@Body::')) {
              const paramName = attr.replace('@Body::', '');
              policy.attributes[attribute] = request.body[paramName];
            }
          }

          return ability.can(
            policy.action,
            subject(policy.resource, { ...policy.attributes })
          );
        }
      ) || []
    );
  }

  /**
   * It replaces the `@me` attribute with the user's internal identifier
   * @param attributes - Record<string, unknown> - The attributes that are being sent to the
   * authorization server.
   * @param {Request} request - The request object that was sent to the API.
   * @returns The attributes object with the @me template replaced with the internalIdentifier of the
   * subject.
   */
  private replaceAttributesTemplate(
    attributes: Record<string, unknown>,
    request: Request
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authorization: any = (request as any).authorization;

    for (const attribute of Object.keys(attributes)) {
      if (typeof attributes[attribute] !== 'string') {
        continue;
      }

      const attr: string = attributes[attribute] as string;

      if (attr === '@Replace::@me') {
        attributes[attribute] = authorization?.subject?.internalIdentifier;
      }
    }

    return attributes;
  }
}
