import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthConsumerService {
  // private readonly authService: AuthService,
  // /**
  //  * It takes an authorization header, passes it to the auth service, and returns the response
  //  * @param {string} authorizationHeader - The authorization header that was sent in the request.
  //  * @returns An object with a subject and roles property.
  //  */
  // async authorize(authorizationHeader: string): Promise<IAuthorizeResponse> {
  //   const authorizeResponse = await this.authService.authorize(
  //     authorizationHeader
  //   );
  //   return {
  //     subject: authorizeResponse.subject,
  //     roles: (authorizeResponse.roles || []).map((role) => ({
  //       id: role.id,
  //       name: role.name,
  //       description: role.description,
  //       polices: role.policies.map(
  //         (policy) =>
  //           ({
  //             action: policy.action,
  //             resource: policy.resource,
  //             attributes: policy.attributes,
  //           } as IRolePolicy)
  //       ),
  //     })),
  //   };
  // }
  // /**
  //  * It creates a user with the given email and password
  //  * @param {string} id - The id of the subject.
  //  * @param {string} email - The email address of the user.
  //  * @param {string} password - string
  //  * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
  //  */
  // async createSubjectAsUser(
  //   id: string,
  //   email: string,
  //   password: string,
  //   queryOptions: QueryOptions = {}
  // ): Promise<ISubject> {
  //   await QueryManager.createTransaction(queryOptions, this.sequelize);
  //   const subject: ISubject = await this.subjectService.create(
  //     id,
  //     SubjectType.USER,
  //     QueryManager.skipTransaction(queryOptions)
  //   );
  //   await this.subjectService.addCredentials(
  //     subject,
  //     CredentialsType.EMAIL_WITH_PASSWORD,
  //     email,
  //     password,
  //     QueryManager.skipTransaction(queryOptions)
  //   );
  //   await this.addRoleToSubject(
  //     subject.id,
  //     process.env.DEFAULT_ROLE_ID, // default user group id
  //     QueryManager.skipTransaction(queryOptions)
  //   );
  //   await QueryManager.commitTransaction(queryOptions);
  //   return subject;
  // }
  // /**
  //  * It creates a new role in the database.
  //  * @param {string} name - The name of the role.
  //  * @param {string} description - The description of the role.
  //  * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
  //  * @returns A promise that resolves to a Role.
  //  */
  // async createRole(
  //   name: string,
  //   description: string,
  //   queryOptions: QueryOptions = {}
  // ): Promise<IRole> {
  //   return this.roleService.create(name, description, queryOptions);
  // }
  // /**
  //  * It returns a promise that resolves to a single role.
  //  * @param {string} name - The name of the role.
  //  * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
  //  * @returns A promise that resolves to a single role.
  //  */
  // findRoleByName(
  //   name: string,
  //   queryOptions: QueryOptions = {}
  // ): Promise<IRole> {
  //   return this.roleService.findByName(name, queryOptions);
  // }
  // /**
  //  * It returns a promise that resolves to a single role.
  //  * @param {string} id - The id of the role.
  //  * @param changes - The changes to be made to the role.
  //  * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
  //  * @returns A promise that resolves to a single role.
  //  */
  // updateRole(
  //   id: string,
  //   changes: Record<string, string>,
  //   queryOptions: QueryOptions = {}
  // ): Promise<IRole> {
  //   return this.roleService.update(id, changes, queryOptions);
  // }
  // /**
  //  * It delete a role in the database.
  //  * @param {string} name - The name of the role.
  //  * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
  //  */
  // async deleteRoleByName(name: string, queryOptions: QueryOptions = {}) {
  //   const role: IRole = await this.findRoleByName(name, queryOptions);
  //   await this.roleService.delete(role.id, queryOptions);
  // }
  // /**
  //  * It creates a new rolePolicy in the database.
  //  * @param {string} action - The action of the rolePolicy.
  //  * @param {string} resource - The resource of the rolePolicy.
  //  * @param {string} attributes - The attributes of the roleolicy.
  //  * @param {string} roleId - The id of the role of the rolePolicy.
  //  * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
  //  * @returns A promise that resolves to a RolePolicy.
  //  */
  // async createRolePolicy(
  //   action: Action,
  //   resource: ResourceName,
  //   attributes: Record<string, unknown>,
  //   roleId: string,
  //   queryOptions: QueryOptions = {}
  // ): Promise<IRolePolicy> {
  //   return this.rolePolicyService.create(
  //     action,
  //     resource,
  //     attributes,
  //     roleId,
  //     queryOptions
  //   );
  // }
  // /**
  //  * Adds a role to a subject
  //  * @param {string} subjectId - The id of the subject you want to add the role to.
  //  * @param {string} roleId - The id of the role to add to the subject.
  //  * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
  //  */
  // async addRoleToSubject(
  //   subjectId: string,
  //   roleId: string,
  //   queryOptions: QueryOptions = {}
  // ): Promise<void> {
  //   await this.subjectService.addRole(
  //     { id: subjectId },
  //     { id: roleId },
  //     queryOptions
  //   );
  // }
  // /**
  //  * Adds a role to a user
  //  * @param {string} userId - The id of the user you want to add the role to.
  //  * @param {string} roleId - The id of the role to add to the user.
  //  * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
  //  */
  // async addRoleToUser(
  //   userId: string,
  //   roleId: string,
  //   queryOptions: QueryOptions = {}
  // ): Promise<void> {
  //   await this.subjectService.addRoleToUser(
  //     { id: userId },
  //     { id: roleId },
  //     queryOptions
  //   );
  // }
  // /**
  //  * Removes a role from a subject
  //  * @param {string} userId - The id of the user you want to remove the role to.
  //  * @param {string} roleId - The id of the role to remove to the user.
  //  * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
  //  */
  // async removeRoleToUser(
  //   userId: string,
  //   roleId: string,
  //   queryOptions: QueryOptions = {}
  // ): Promise<void> {
  //   await this.subjectService.removeRoleToUser(
  //     { id: userId },
  //     { id: roleId },
  //     queryOptions
  //   );
  // }
}
