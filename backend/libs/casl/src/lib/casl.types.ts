import { Ability } from '@casl/ability';
import { Request } from 'express';

/* This is the entities that are used in the application. */
export enum ResourceName {
  USER = 'user',
  USER_EMAIL = 'user_email',
  USER_SETTINGS = 'user_settings',
  MODULE = 'module',
  CONTENT = 'content',
  TEAM = 'team',
  TEAM_MEMBER = 'team_member',
  ITEM = 'item',
  TRANSACTION = 'transaction',
  SUBMISSION = 'submission',
}

/* Creating an enum with the values of Manage, Create, Read, Update, and Delete. */
export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

/* This is the different operations that are used for the policies. */
export enum Operator {
  AND = 'and',
  OR = 'or',
}

/* This is defining the shape of the policy object. */
export interface Policy {
  action: Action;
  resource: string;
  attributes?: Record<string, unknown>;
}
export type Policies = Policy[];

export type SubjectAbility = Ability<
  [Action, string | Record<string, unknown>]
>;

export type PolicyHandlerCallback = (
  ability: SubjectAbility,
  request: Request
) => boolean;

export interface IPolicyHandler {
  handle(ability: SubjectAbility, request: Request): boolean;
}

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;
