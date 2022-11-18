import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ParseUUIDOrMePipe } from '@polycode/validation';

export const Incoming = createParamDecorator((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request;
});

export const Subject = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (key) {
      return request.authorization?.subject[key];
    }

    return request.authorization?.subject;
  }
);

export const UserId = createParamDecorator(
  (key = 'userId', ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const pipe = new ParseUUIDOrMePipe(key);

    return pipe.transform(request);
  }
);
