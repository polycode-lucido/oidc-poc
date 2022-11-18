import { defaults } from 'lodash';

export interface FormatOptions {
  fields?: string[];
  excludes?: string[];
}

export abstract class GenericService<T> {
  private formatOptions: FormatOptions;

  constructor(formatOptions: FormatOptions) {
    this.formatOptions = formatOptions;
  }

  /**
   * It takes an entity or an array of entities and returns a formatted version of the entity or an
   * array of formatted entities
   * @param {T | T[]} entity - T | T[]
   * @param {FormatOptions} [options] - FormatOptions
   * @returns An object with the fields specified in the options.fields array.
   */
  format(entity: T | T[], options?: FormatOptions): Partial<T> | Partial<T>[] {
    options = defaults(options, this.formatOptions);

    if (Array.isArray(entity)) {
      return entity.map((e) => this.format(e, options)) as Partial<T>[];
    }

    const result: Partial<T> = {};

    if (entity) {
      if (options.fields) {
        options.fields.forEach((field) => {
          result[field] = entity[field];
        });
      } else {
        Object.keys(entity).forEach((field) => {
          if (!options.excludes?.includes(field)) {
            result[field] = entity[field];
          }
        });
      }
    }

    return result;
  }
}

export * from './sequelize.generic';
