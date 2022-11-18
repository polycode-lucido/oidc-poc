import {
  Injectable,
  PipeTransform,
  ExecutionContext,
  CallHandler,
  NestInterceptor,
  applyDecorators,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';
import { Observable } from 'rxjs';

export type FilterOptionsKey = {
  defaultValue?: string | null | undefined;
  values?: string[];
  matching?: boolean;
};

export type FilterOptionsArray = {
  defaultValue?: string | null | undefined;
  containsAll?: boolean;
};

export type FilterOptionsKeys = {
  [key: string]: FilterOptionsKey;
};

export type FilterOptionsArrays = {
  [key: string]: FilterOptionsArray;
};

export type FilterResultKeys = {
  [key: string]: { value: string; matching: boolean };
};

export type FilterResultArrays = {
  [key: string]: { value: string; containsAll: boolean };
};

export interface FilterOptions {
  keys?: FilterOptionsKeys;
  arrays?: FilterOptionsArrays;
}

export interface FilterResult {
  keys: FilterResultKeys;
  arrays: FilterResultArrays;
}

declare module 'express' {
  interface Request {
    filter?: FilterResult;
  }
}

@Injectable()
export class FilterPipe implements PipeTransform {
  private keys: FilterOptionsKeys;
  private arrays: FilterOptionsArrays;

  constructor(keys = {}, arrays = {}) {
    this.keys = keys;
    this.arrays = arrays;
  }

  /**
   * If the query parameter is not in the request, then use the default value. If the query parameter
   * is in the request, then check if the value is in the list of allowed values. If the value is not
   * in the list of allowed values, then throw an error
   * @param {Request} request - Request - The request object that is passed to the controller.
   * @returns An object with a key of keys and a value of an object with keys and values.
   */
  transform(request: Request): FilterResult {
    const keys: FilterResultKeys = {};

    for (const key in this.keys) {
      if (key in request.query) {
        if (this.keys[key].values) {
          if (
            !this.keys[key].values.length &&
            !this.keys[key].values.includes(`${request.query[key]}`)
          ) {
            throw new BadRequestException();
          }
        }

        keys[key] = {
          value: request.query[key] as string,
          matching: this.keys[key].matching,
        };
      } else if (this.keys[key].defaultValue) {
        keys[key] = {
          value: this.keys[key].defaultValue,
          matching: this.keys[key].matching,
        };
      }
    }

    const arrays: FilterResultArrays = {};

    for (const key in this.arrays) {
      if (key in request.query) {
        arrays[key] = {
          value: request.query[key] as string,
          containsAll: this.arrays[key].containsAll,
        };
      } else if (this.arrays[key].defaultValue) {
        arrays[key] = {
          value: this.arrays[key].defaultValue,
          containsAll: this.arrays[key].containsAll,
        };
      }
    }

    return { keys, arrays };
  }
}

@Injectable()
export class FilterInterceptor implements NestInterceptor {
  private options: FilterOptions;

  constructor(options: FilterOptions) {
    this.options = options;
  }

  /**
   * The `intercept` function is called by NestJS when a request is made to the server. It takes the
   * request and passes it to the `FilterPipe` class, which returns a `filter` object. The `filter`
   * object is then added to the request object
   * @param {ExecutionContext} context - ExecutionContext - This is the context of the request.
   * @param {CallHandler} next - CallHandler - The next handler in the chain.
   * @returns The request object with the filter property added to it.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<void> {
    const request = context.switchToHttp().getRequest();

    const filter = new FilterPipe(
      this.options?.keys,
      this.options?.arrays
    ).transform(request);
    request.filter = filter;

    return next.handle();
  }
}

export const Filter = (options: FilterOptions = {}) =>
  applyDecorators(
    UseInterceptors(new FilterInterceptor(options)),
    ...(options.keys
      ? Object.keys(options.keys).map((key) =>
          ApiQuery({
            name: key,
            type: 'string',
            enum: options.keys[key].values?.length
              ? options.keys[key].values
              : undefined,
            required: false,
            description: `Filter results by ${key} ${
              options.keys[key].matching ? '(matching)' : ''
            }`,
            schema: {
              default: options.keys[key].defaultValue || undefined,
            },
          })
        )
      : []),
    ...(options.arrays
      ? Object.keys(options.arrays).map((key) =>
          ApiQuery({
            name: key,
            type: 'string',
            required: false,
            description: `Filter results by ${key}. Must be enclosed in square brackets, and be separated by commas ${
              options.arrays[key].containsAll ? '(contains all)' : ''
            }`,
            schema: {
              default: options.arrays[key].defaultValue || undefined,
            },
          })
        )
      : [])
  );
