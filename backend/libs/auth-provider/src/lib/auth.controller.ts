import { Body, Controller, Post } from '@nestjs/common';
import { OAuth2Service } from './services/oauth2.service';
import { OAuth2AuthenticateDto } from './templates/dtos/authenticate.dto';
import { ApiRoute } from '@polycode/docs';
import { OAuth2ClientGrant } from './entities/OAuth2ClientGrant.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentification')
export class AuthController {
  constructor(private readonly oAuth2Service: OAuth2Service) {}

  @Post('/token')
  @ApiRoute({
    operation: {
      summary: 'Authenticate a subject through the OAuth2 protocol',
      description: 'Get a new access token and an optional refresh token',
    },
    body: {
      schema: {
        type: 'object',
        required: ['grantType'],
        properties: {
          clientId: {
            type: 'string',
            format: 'uuid',
            description:
              'The client id who requested the token (required if grantType is not `implicit`)',
          },
          clientSecret: {
            type: 'string',
            description:
              'The client secret who requested the token (required if grantType is not `implicit`)',
          },
          grantType: {
            type: 'string',
            enum: [...Object.values(OAuth2ClientGrant)],
            default: OAuth2ClientGrant.IMPLICIT,
            description: 'The grant type of the token',
          },
          identity: {
            type: 'string',
            description:
              'The identity of the subject (required if grantType is `implicit` or `password`)',
          },
          secret: {
            type: 'string',
            description:
              'The secret of the subject (required if grantType is `implicit` or `password`)',
          },
        },
      },
    },
    response: {
      status: 201,
      description:
        'Returns an access token and an optional refresh token (if grantType is not `implicit`) if the request is valid and approved',
      schema: {
        type: 'object',
        required: ['accessToken'],
        properties: {
          accessToken: {
            type: 'string',
            description: 'The access token',
          },
          refreshToken: {
            type: 'string',
            description: 'The refresh token',
          },
        },
      },
    },
  })
  async token(@Body() oAuth2AuthenticateDto: OAuth2AuthenticateDto) {
    return this.oAuth2Service.authenticate(oAuth2AuthenticateDto);
  }
}
