import {
  Injectable,
  PipeTransform,
  ExecutionContext,
  CallHandler,
  NestInterceptor,
  applyDecorators,
  UseInterceptors,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';
import { Observable } from 'rxjs';

export type OrderKey = 'asc' | 'desc' | null;
export type OrderKeys = { [key: string]: OrderKey };

export interface OrderOptions {
  keys?: OrderKeys;
}

export interface OrderResult {
  keys: OrderKeys;
}

declare module 'express' {
  interface Request {
    order?: OrderResult;
  }
}

@Injectable()
export class OrderPipe implements PipeTransform {
  private keys: OrderKeys;

  constructor(keys = {}) {
    this.keys = keys;
  }

  /**
   * It takes a request object, and returns an object with a keys property that is an object with the
   * same keys as the keys property of the OrderKeysTransformer instance, but with the values of the
   * keys being either 'asc' or 'desc'
   * @param {Request} request - Request - The request object from the controller
   * @returns An object with a key of keys and a value of an object with keys of the keys passed in and
   * values of the order.
   */
  transform(request: Request): OrderResult {
    if (!Object.keys(this.keys).length) {
      return { keys: {} };
    }

    const result: OrderKeys = {};

    const order = request.query['order-by'] as string;
    if (order) {
      const orderKeys = order.split(',');
      orderKeys.forEach((key) => {
        const [keyName, keyOrder] = key.split(':');
        if (keyName in this.keys) {
          result[keyName] = keyOrder as OrderKey;
        }
      });
    }

    for (const key in this.keys) {
      if (!result[key] && this.keys[key]) {
        result[key] = this.keys[key];
      } else if ((result[key] as string) === 'null') {
        delete result[key];
      }
    }

    return { keys: result };
  }
}

@Injectable()
export class OrderInterceptor implements NestInterceptor {
  private options: OrderOptions;

  constructor(options: OrderOptions) {
    this.options = options;
  }

  /**
   * It takes the request object, and uses the OrderPipe to transform it into an object with the order
   * parameters
   * @param {ExecutionContext} context - ExecutionContext - The context of the request.
   * @param {CallHandler} next - CallHandler - The next handler in the chain.
   * @returns The order object
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<void> {
    const request = context.switchToHttp().getRequest();

    const order = new OrderPipe(this.options?.keys).transform(request);
    request.order = order;

    return next.handle();
  }
}

export const Order = (options: OrderOptions = {}) =>
  applyDecorators(
    UseInterceptors(new OrderInterceptor(options)),
    ...(options.keys && [
      ApiQuery({
        name: 'order-by',
        description: 'Available keys: ' + Object.keys(options.keys).join(', '),
        type: 'string',
        required: false,
        schema: {
          type: 'string',
          example: Object.keys(options.keys)
            .map((key) => `${key}:${options.keys[key]}`)
            .join(','),
        },
      }),
    ])
  );
