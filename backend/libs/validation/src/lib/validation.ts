import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { validate } from 'uuid';

@Injectable()
export class ParseUUIDOrMePipe implements PipeTransform {
  private paramName: string;

  constructor(paramName = 'id') {
    this.paramName = paramName;
  }

  transform(request: Request) {
    const id = request.params[this.paramName];

    if (!id || (id !== '@me' && !validate(id))) {
      throw new BadRequestException(`Invalid ${this.paramName}`);
    }

    if (id === '@me') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(request as any).authorization?.subject?.internalIdentifier) {
        throw new BadRequestException();
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (request as any).authorization?.subject?.internalIdentifier;
    }

    return id;
  }
}
