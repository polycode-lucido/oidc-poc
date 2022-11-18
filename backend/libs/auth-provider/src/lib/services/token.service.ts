import {
  ForbiddenException,
  Injectable,
  PreconditionFailedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Subject } from '../entities/Subject.entity';
import { OAuth2Client } from '../entities/OAuth2Client.entity';
import { OAuth2Token, TokenType } from '../entities/OAuth2Token.entity';
import { OAuth2ClientGrant } from '../entities/OAuth2ClientGrant.entity';
import { CryptoService } from './crypto.service';
import { Op } from 'sequelize';
import { Role } from '../entities/Role.entity';
import { RolePolicies } from '../entities/RolePolicies.entity';
import { QueryManager, QueryOptions } from '@polycode/query-manager';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly encryptService: CryptoService
  ) {}

  /**
   * It finds a token in the database and returns it
   * @param {string} bearer - The token that was sent in the request.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns A token
   */
  async find(
    bearer: string,
    queryOptions: QueryOptions = {}
  ): Promise<OAuth2Token> {
    const token = await QueryManager.findOne<OAuth2Token | null>(
      OAuth2Token,
      {
        attributes: ['id', 'hashedToken', 'tokenExpireAt', 'type'],
        where: {
          hashedToken: this.encryptService.hash256(bearer),
          tokenExpireAt: {
            [Op.gte]: new Date(),
          },
        },
        include: [
          {
            model: Subject,
            as: 'subject',
            attributes: ['id', 'type', 'internalIdentifier'],
            required: false,
            include: [
              {
                model: Role,
                as: 'roles',
                attributes: ['id', 'name'],
                required: false,
                through: {
                  attributes: [],
                },
                include: [
                  {
                    model: RolePolicies,
                    as: 'policies',
                    attributes: ['id', 'action', 'resource', 'attributes'],
                    required: false,
                  },
                ],
              },
            ],
          },
          {
            model: OAuth2Client,
            as: 'client',
            attributes: ['id'],
            required: false,
          },
        ],
      },
      queryOptions
    );

    if (!token) {
      throw new ForbiddenException();
    }

    return token;
  }

  /**
   * It verifies the token and returns the OAuth2Token
   * @param {string} token - The token to verify
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   * @returns The token is being returned.
   */
  verifyToken(
    token: string,
    queryOptions: QueryOptions = {}
  ): Promise<OAuth2Token> {
    try {
      this.jwtService.verify(token, {
        issuer: process.env.AUTH_JWT_ISSUER,
        audience: process.env.AUTH_JWT_AUDIENCE,
      });
    } catch (err) {
      throw new ForbiddenException();
    }

    return this.find(token, queryOptions);
  }

  /**
   * It creates a token for a subject, which is a user or a service, and it can be used to access the
   * API
   * @param {Subject} subject - The subject of the token. This is the user or client that the token is
   * being created for.
   * @param {OAuth2Client} client - OAuth2Client,
   * @param {Date} expireAt - The date at which the token should expire.
   * @returns A string
   */
  createSubjectAccessToken(
    subject: Subject,
    client: OAuth2Client,
    expireAt: Date
  ): string {
    return this.createToken(
      {
        subject: subject.id,
        subjectType: subject.type,
        internalIdentifier: subject.internalIdentifier,
        type: TokenType.ACCESS_TOKEN,
        ...(client && { requestedClientId: client.id }),
      },
      { expiresIn: this.calculateMillisecondsUntilExpiration(expireAt) }
    );
  }

  /**
   * It creates a refresh token for a subject
   * @param {Subject} subject - The subject of the token. This is the user or client that the token is
   * being created for.
   * @param {OAuth2Client} client - OAuth2Client - The client that requested the token.
   * @param {Date} expireAt - Date - The date at which the token should expire.
   * @returns A string
   */
  createSubjectRefreshToken(
    subject: Subject,
    client: OAuth2Client,
    expireAt: Date
  ): string {
    return this.createToken(
      {
        subject: subject.id,
        subjectType: subject.type,
        internalIdentifier: subject.internalIdentifier,
        type: TokenType.REFRESH_TOKEN,
        ...(client && { requestedClientId: client.id }),
      },
      { expiresIn: this.calculateMillisecondsUntilExpiration(expireAt) }
    );
  }

  /**
   * It creates a JWT token using the data passed to it and the options passed to it
   * @param {any} data - Record<string, unknown> - The data to be encoded.
   * @param {JwtSignOptions} options - JwtSignOptions = {}
   * @returns A JWT token
   */
  createToken(
    data: Record<string, unknown>,
    options: JwtSignOptions = {}
  ): string {
    return this.jwtService.sign(
      { ...data },
      {
        issuer: process.env.AUTH_JWT_ISSUER,
        audience: process.env.AUTH_JWT_AUDIENCE,
        expiresIn: '30 days',
        ...options,
      }
    );
  }

  /**
   * It saves a token to the database
   * @param {string} token - The token string
   * @param {Date} expiration - The expiration date of the token.
   * @param {TokenType} type - The type of the token.
   * @param {OAuth2ClientGrant} grant - OAuth2ClientGrant
   * @param {Subject} [subject] - The user that is being authenticated.
   * @param {OAuth2Client} [client] - The client that requested the token.
   * @param {QueryOptions} queryOptions - This is an optional parameter that contains transaction and pagination information.
   */
  async saveToken(
    token: string,
    expiration: Date,
    type: TokenType,
    grant: OAuth2ClientGrant,
    subject?: Subject,
    client?: OAuth2Client,
    queryOptions: QueryOptions = {}
  ): Promise<void> {
    if (!subject && !client) {
      throw new PreconditionFailedException();
    }

    return QueryManager.create(
      OAuth2Token,
      {
        hashedToken: this.encryptService.hash256(token),
        tokenExpireAt: expiration,
        type,
        grantWith: grant,
        ...(subject && { subjectId: subject.id }),
        ...(client && { requestedClientId: client.id }),
      },
      queryOptions
    );
  }

  /**
   * It takes a date and returns the number of milliseconds until that date
   * @param {Date} expiration - The date and time when the token expires.
   * @returns The number of milliseconds until the expiration date.
   */
  calculateMillisecondsUntilExpiration(expiration: Date): number {
    return expiration.getTime() - Date.now();
  }
}
