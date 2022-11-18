import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_CONSUMER_DECORATOR_SUBJECT_TYPES } from './auth-consumer.constants';
import {
  AuthConsumerService,
  IAuthorizeResponse,
} from './auth-consumer.service';
import { SubjectType } from '@polycode/auth-provider';
import { Request } from 'express';

declare module 'express' {
  interface Request {
    authorization?: IAuthorizeResponse;
  }
}

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly authConsumerService: AuthConsumerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const request: Request = http.getRequest();
    const authorizationHeader = request.headers.authorization;

    const response = await this.authConsumerService.authorize(
      authorizationHeader
    );

    request.authorization = response;
    return true;
  }
}

@Injectable()
export class SubjectTypeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const request: Request = http.getRequest();

    if (!request.authorization?.subject?.type) {
      return false;
    }

    const subjectTypes = this.reflector.get<SubjectType[]>(
      AUTH_CONSUMER_DECORATOR_SUBJECT_TYPES,
      context.getHandler()
    );

    if (!subjectTypes || !subjectTypes.length) {
      return true;
    }

    /* Checking if the subject type is in the array of subject types. */
    const subjectTypeIndex = subjectTypes.findIndex(
      (subjectType) => subjectType === request.authorization?.subject?.type
    );

    if (subjectTypeIndex === -1) {
      throw new ForbiddenException(
        `Forbidden access for subject type ${request.authorization?.subject?.type}.`
      );
    }

    return true;
  }
}
