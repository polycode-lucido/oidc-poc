import { BadRequestException, Injectable } from '@nestjs/common';
import { TokenService } from './token.service';
import { OAuth2AuthenticateDto } from '../templates/dtos/authenticate.dto';
import { OAuth2ClientGrant } from '../entities/OAuth2ClientGrant.entity';
import { SubjectService } from './subject.service';
import { DateTime } from 'luxon';
import { TokenType } from '../entities/OAuth2Token.entity';
import { Sequelize } from 'sequelize-typescript';
import { QueryManager, QueryOptions } from '@polycode/query-manager';

@Injectable()
export class OAuth2Service {
  constructor(
    private readonly tokenService: TokenService,
    private readonly subjectService: SubjectService,
    private readonly sequelize: Sequelize
  ) {}

  /**
   * > This function is called when a user tries to authenticate with the OAuth2 server
   * @param {OAuth2AuthenticateDto} oAuth2AuthenticateDto - This is the object that contains the
   * parameters that are passed in the request.
   * @returns The access token and an optional refresh token
   */
  async authenticate(
    oAuth2AuthenticateDto: OAuth2AuthenticateDto
  ): Promise<Record<string, unknown>> {
    if (oAuth2AuthenticateDto.grantType === OAuth2ClientGrant.IMPLICIT) {
      return this.handleImplicitGrant(oAuth2AuthenticateDto);
    }

    throw new BadRequestException(
      'Invalid grantType: grantType is not supported'
    );
  }

  /**
   * It creates an access token for the subject, saves it, and returns it
   * @param {OAuth2AuthenticateDto} oAuth2AuthenticateDto - OAuth2AuthenticateDto
   * @returns An object with the access token and the token type.
   */
  async handleImplicitGrant(oAuth2AuthenticateDto: OAuth2AuthenticateDto) {
    const queryOptions: QueryOptions = {};

    await QueryManager.createTransaction(queryOptions, this.sequelize);

    const subject = await this.subjectService.getByCredentials(
      oAuth2AuthenticateDto.identity,
      oAuth2AuthenticateDto.secret,
      queryOptions
    );

    const expiresAt = this.getExpirationDateByGrantType(
      OAuth2ClientGrant.IMPLICIT
    );

    const accessToken = this.tokenService.createSubjectAccessToken(
      subject,
      null,
      expiresAt
    );

    await this.tokenService.saveToken(
      accessToken,
      expiresAt,
      TokenType.ACCESS_TOKEN,
      OAuth2ClientGrant.IMPLICIT,
      subject,
      null,
      queryOptions
    );

    await QueryManager.commitTransaction(queryOptions);

    return {
      accessToken: accessToken,
      tokenType: 'Bearer',
      expiresAt: expiresAt,
    };
  }

  /**
   * If the grant type is IMPLICIT, return a date 3 days from now, otherwise return a date 1 hour from
   * now.
   * @param {OAuth2ClientGrant} grantType - The type of grant that the client is requesting.
   * @returns A date object
   */
  getExpirationDateByGrantType(grantType: OAuth2ClientGrant) {
    switch (grantType) {
      case OAuth2ClientGrant.IMPLICIT:
        return DateTime.now().plus({ days: 3 }).toJSDate();
      default:
        return DateTime.now().plus({ hour: 1 }).toJSDate();
    }
  }
}
