import {
  BadRequestException,
  Injectable,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';

@Injectable()
export class ParseMePipe implements PipeTransform {
  private paramName = 'userId';

  constructor(private readonly userService: UserService) {}

  async transform(request: Request) {
    const id = request.params[this.paramName];

    if (!id) {
      throw new BadRequestException(`Invalid ${this.paramName}`);
    }

    if (id === '@me') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(request as any).authorization?.email) {
        throw new BadRequestException();
      }

      const user = await this.userService.findUserByEmail(
        (request as any).authorization.email
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return ((request as any).userId = user.id);
    }

    return id;
  }
}

@Injectable()
export class ParseMeOnlySelfPipe implements PipeTransform {
  private paramName = 'userId';

  constructor(private readonly userService: UserService) {}

  async transform(request: Request) {
    const id = request.params[this.paramName];

    if (!id) {
      throw new BadRequestException(`Invalid ${this.paramName}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(request as any).authorization?.email) {
      throw new BadRequestException();
    }

    const user = await this.userService.findUserByEmail(
      (request as any).authorization.email
    );

    if (id === '@me') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return ((request as any).userId = user.id);
    }

    if (
      id !== user.id &&
      !(request as any).authorization?.realm_access?.roles.includes('app-admin')
    ) {
      throw new UnauthorizedException();
    }

    return id;
  }
}
