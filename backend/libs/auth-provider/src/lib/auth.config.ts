import { Inject, Injectable } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';
import { JwtOptionsFactory } from '@nestjs/jwt';
import * as Joi from 'joi';
import {
  KeycloakConnectOptions,
  KeycloakConnectOptionsFactory,
  PolicyEnforcementMode,
  TokenValidation,
} from 'nest-keycloak-connect';

export const validationSchema = Joi.object({
  KEYCLOAK_RSA_PUBLIC_KEY: Joi.string().required(),
  KEYCLOAK_REALM: Joi.string().required(),
  KEYCLOAK_CLIENT_ID: Joi.string().required(),
  KEYCLOAK_SECRET: Joi.string().required(),
  KEYCLOAK_URL: Joi.string().default('http://localhost:8080/'),
  KEYCLOAK_SCOPE: Joi.string().default('profile'),
  KEYCLOAK_RESPONSE_TYPE: Joi.string().default('code'),
  KEYCLOAK_REDIRECT_URI: Joi.string().default('http://localhost:3001/sign-in'),
});

export const registerer = registerAs('auth', () => {
  return {
    keycloakRsaPublicKey: process.env['KEYCLOAK_RSA_PUBLIC_KEY'].replace(
      /\\n/gm,
      '\n'
    ),
    keycloakRealm: process.env['KEYCLOAK_REALM'],
    keycloakClientId: process.env['KEYCLOAK_CLIENT_ID'],
    keycloakClientSecret: process.env['KEYCLOAK_SECRET'],
    keycloakUrl: process.env['KEYCLOAK_URL'],
    keycloakScope: process.env['KEYCLOAK_SCOPE'],
    keycloakResponseType: process.env['KEYCLOAK_RESPONSE_TYPE'],
    keycloakRedirectUri: process.env['KEYCLOAK_REDIRECT_URI'],

    keycloakOIDCPath:
      process.env['KEYCLOAK_URL'] + 'realms/polycode/protocol/openid-connect/',
  };
});

@Injectable()
export class AuthConfigService
  implements JwtOptionsFactory, KeycloakConnectOptionsFactory
{
  constructor(
    @Inject(registerer.KEY)
    private authConfig: ConfigType<typeof registerer>
  ) {}

  createKeycloakConnectOptions():
    | KeycloakConnectOptions
    | Promise<KeycloakConnectOptions> {
    return {
      authServerUrl: this.authConfig.keycloakUrl,
      realm: this.authConfig.keycloakRealm,
      clientId: this.authConfig.keycloakClientId,
      secret: this.authConfig.keycloakClientSecret,
      policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
      tokenValidation: TokenValidation.ONLINE,
    };
  }

  createJwtOptions() {
    return {
      publicKey: this.authConfig.keycloakRsaPublicKey,
    };
  }
}
