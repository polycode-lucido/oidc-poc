import { GenericService } from '../service';
import { defaults } from 'lodash';

export interface GenericControllerOptions {
  format?: boolean;
}

/**
 * It takes a function as annotation and returns a new function that calls the original function and then formats the
 * result
 * @returns A function that takes in 3 parameters.
 */
export const GenericRoute = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalValue = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      let result = originalValue.apply(this, args);

      if (result instanceof Promise) {
        result = await result;
      }

      if (this.options.format) {
        return this.service.format(result);
      }

      return result;
    };
  };
};

export class GenericController {
  constructor(
    readonly service: GenericService<unknown>,
    readonly options: GenericControllerOptions = {}
  ) {
    this.options = defaults(this.options, { format: true });
  }
}

export * from './sequelize.generic';
