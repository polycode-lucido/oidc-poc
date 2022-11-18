import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Subject, SubjectType } from '../entities/Subject.entity';
import {
  CredentialsType,
  SubjectCredentials,
} from '../entities/SubjectCredentials.entity';
import { CryptoService } from './crypto.service';
import { SubjectRoles } from '../entities/SubjectRoles.entity';
import { QueryManager, QueryOptions } from '@polycode/query-manager';
import { is404 } from '@polycode/to';

@Injectable()
export class SubjectService {
  constructor(private readonly cryptoService: CryptoService) {}

  /**
   * Returns the subject with the given userId.
   * @param {string} userId - The userId of the subject.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A subject
   */
  async getByUserId(
    userId: string,
    queryOptions: QueryOptions = {}
  ): Promise<Subject> {
    return await QueryManager.findOne<Subject>(
      Subject,
      {
        where: {
          internalIdentifier: userId,
        },
      },
      { validator: is404, ...queryOptions }
    );
  }

  /**
   * It takes a username and password, and returns a user if the username and password are valid
   * @param {string} identity - The identity of the subject.
   * @param {string} secret - The secret that the subject is trying to authenticate with.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A subject
   */
  async getByCredentials(
    identity: string,
    secret: string,
    queryOptions: QueryOptions = {}
  ): Promise<Subject> {
    const subject = await QueryManager.findOne<Subject | null>(
      Subject,
      {
        include: [
          {
            model: SubjectCredentials,
            as: 'credentials',
            required: true,
            where: {
              identity,
            },
          },
        ],
      },
      queryOptions
    );

    if (!subject) {
      await QueryManager.commitTransaction(queryOptions);
      throw new UnauthorizedException('Invalid subject: subject not found');
    }

    if (
      !(await this.cryptoService.compareBcrypt(
        secret,
        subject.credentials.secret
      ))
    ) {
      await QueryManager.commitTransaction(queryOptions);
      throw new UnauthorizedException('Invalid subject: secret is invalid');
    }

    return subject;
  }

  /**
   * It creates a new subject in the database
   * @param {string} internalIdentifier - The internal identifier of the subject.
   * @param {SubjectType} type - SubjectType - This is the type of the subject. It can be either a user
   * or a group.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A promise that resolves to a Subject
   */
  async create(
    internalIdentifier: string,
    type: SubjectType,
    queryOptions: QueryOptions = {}
  ): Promise<Subject> {
    return QueryManager.create<Subject>(
      Subject,
      {
        internalIdentifier,
        type,
      },
      queryOptions
    );
  }

  /**
   * It creates a new SubjectCredentials object, hashes the secret, and saves it to the database
   * @param {Subject} subject - The subject that the credentials are being added to.
   * @param {CredentialsType} type - CredentialsType - this is an enum that is defined in the
   * SubjectCredentials model. It's a string that can be one of the following:
   * @param {string} identity - The username or email address of the user
   * @param {string} secret - The secret that the user entered.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A promise that resolves to a SubjectCredentials object.
   */
  async addCredentials(
    subject: { id: string },
    type: CredentialsType,
    identity: string,
    secret: string,
    queryOptions: QueryOptions = {}
  ): Promise<SubjectCredentials> {
    return QueryManager.create<SubjectCredentials>(
      SubjectCredentials,
      {
        subjectId: subject.id,
        type,
        identity,
        secret: await this.cryptoService.hashBcrypt(secret),
      },
      queryOptions
    );
  }

  /**
   * > Add a role to a subject
   * @param {Subject} subject - Subject - The subject to add the role to
   * @param {Role} role - Role - This is the role that we want to add to the subject.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A promise of a SubjectRoles object
   */
  async addRole(
    subject: { id: string },
    role: { id: string },
    queryOptions: QueryOptions = {}
  ): Promise<SubjectRoles> {
    const exists = await QueryManager.findOne<SubjectRoles>(
      SubjectRoles,
      {
        where: {
          subjectId: subject.id,
          roleId: role.id,
        },
      },
      queryOptions
    );

    if (exists) {
      return exists;
    }

    return QueryManager.create<SubjectRoles>(
      SubjectRoles,
      {
        subjectId: subject.id,
        roleId: role.id,
      },
      queryOptions
    );
  }

  /**
   * > Remove a role to a subject
   * @param {Subject} subject - Subject - The subject to remove the role to
   * @param {Role} role - Role - This is the role that we want to remove to the subject.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A promise of a SubjectRoles object
   */
  async removeRole(
    subject: { id: string },
    role: { id: string },
    queryOptions: QueryOptions = {}
  ) {
    const subjectRole = await QueryManager.findOne<SubjectRoles>(
      SubjectRoles,
      {
        where: {
          subjectId: subject.id,
          roleId: role.id,
        },
      },
      { validator: is404, ...queryOptions }
    );

    await QueryManager.destroyInstance(subjectRole, queryOptions);
  }

  /**
   * > Add a role to a user
   * @param {User} user - User - The user to add the role to
   * @param {Role} role - Role - This is the role that we want to add to the user.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A promise of a UserRoles object
   */
  async addRoleToUser(
    user: { id: string },
    role: { id: string },
    queryOptions: QueryOptions = {}
  ): Promise<SubjectRoles> {
    const subject: Subject = await this.getByUserId(user.id);

    return await this.addRole({ id: subject.id }, role, queryOptions);
  }

  /**
   * Removes a role from a subject
   * @param {User} user - User - The user to add the role to
   * @param {Role} role - Role - This is the role that we want to add to the user.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   */
  async removeRoleToUser(
    user: { id: string },
    role: { id: string },
    queryOptions: QueryOptions = {}
  ) {
    const subject: Subject = await this.getByUserId(user.id);

    await this.removeRole({ id: subject.id }, { id: role.id }, queryOptions);
  }
}
