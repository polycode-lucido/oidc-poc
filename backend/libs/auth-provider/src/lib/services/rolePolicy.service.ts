import { Injectable } from '@nestjs/common';
import { RolePolicies } from '../entities/RolePolicies.entity';
import { QueryManager, QueryOptions } from '@polycode/query-manager';
import { Action, ResourceName } from '@polycode/casl';

@Injectable()
export class RolePolicyService {
  /**
   * It creates a new rolePolicy in the database.
   * @param {string} action - The action of the rolePolicy.
   * @param {string} resource - The resource of the rolePolicy.
   * @param {string} attributes - The attributes of the roleolicy.
   * @param {string} roleId - The id of the role of the rolePolicy.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A promise that resolves to a RolePolicies.
   */
  async create(
    action: Action,
    resource: ResourceName,
    attributes: Record<string, unknown>,
    roleId: string,
    queryOptions: QueryOptions = {}
  ): Promise<RolePolicies> {
    return QueryManager.create<RolePolicies>(
      RolePolicies,
      {
        action,
        resource,
        attributes,
        roleId,
      },
      queryOptions
    );
  }
}
