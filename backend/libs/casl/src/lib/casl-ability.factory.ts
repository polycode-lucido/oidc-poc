import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action, Policies, SubjectAbility } from './casl.types';

@Injectable()
export class CaslAbilityFactory {
  /**
   * It takes an array of policies and returns an ability
   * @param {Policies} policies - Policies
   * @returns A function that takes in an action, resource, and attributes and returns a boolean.
   */
  create(policies: Policies) {
    const { can, build } = new AbilityBuilder<
      Ability<[Action, string | Record<string, unknown>]>
    >(Ability as AbilityClass<SubjectAbility>);

    for (const policy of policies) {
      can(policy.action, policy.resource, policy.attributes);
    }

    return build();
  }
}
