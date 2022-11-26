import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UserService } from '@polycode/user';
import { Request } from 'express';

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
