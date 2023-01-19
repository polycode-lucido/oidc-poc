import { HttpService } from '@nestjs/axios';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserEmailService, UserService } from '@polycode/user';
import { IsJWT, IsNumber } from 'class-validator';
import * as queryString from 'querystring';
import { catchError, concatMap, firstValueFrom, map, tap } from 'rxjs';
import { registerer } from './auth.config';
import { UserEmail } from '@polycode/shared';
import { randomUUID } from 'crypto';

export class KeycloakToken {
  @IsJWT()
  access_token: string;
  @IsJWT()
  refresh_token: string;
  @IsNumber()
  expires_in: number;
  @IsNumber()
  refresh_expires_in: number;

  constructor(
    access_token: string,
    refresh_token: string,
    expires_in: number,
    refresh_expires_in: number
  ) {
    this.access_token = access_token;
    this.refresh_token = refresh_token;
    this.expires_in = expires_in;
    this.refresh_expires_in = refresh_expires_in;
  }
}

@Injectable()
export class AuthService {
  private keycloakOIDCPath: string;
  private keycloakResponseType: string;
  private keycloakScope: string;
  private keycloakRedirectUri: string;
  private keycloakClientId: string;
  private keycloakClientSecret: string;

  private sessionMap = new Map<string, { [key: string]: unknown }>();
  private sessionToken = new Map<string, string>();
  private sessionRefreshToken = new Map<string, string>();

  constructor(
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly userEmailService: UserEmailService,
    @Inject(registerer.KEY)
    private authConfig: ConfigType<typeof registerer>
  ) {
    this.keycloakOIDCPath = this.authConfig.keycloakOIDCPath;
    this.keycloakResponseType = this.authConfig.keycloakResponseType;
    this.keycloakScope = this.authConfig.keycloakScope;
    this.keycloakRedirectUri = this.authConfig.keycloakRedirectUri;
    this.keycloakClientId = this.authConfig.keycloakClientId;
    this.keycloakClientSecret = this.authConfig.keycloakClientSecret;
  }

  getUrlLogin(): string {
    return (
      `${this.keycloakOIDCPath}` +
      `auth` +
      `?client_id=${this.keycloakClientId}` +
      `&response_type=${this.keycloakResponseType}` +
      `&scope=${this.keycloakScope}` +
      `&redirect_uri=${queryString.escape(this.keycloakRedirectUri)}`
    );
  }

  async getAccessToken(code: string) {
    const params = {
      grant_type: 'authorization_code',
      client_id: this.keycloakClientId,
      client_secret: this.keycloakClientSecret,
      code,
      redirect_uri: this.keycloakRedirectUri,
    };

    const session = await firstValueFrom(
      this.httpService
        .post(
          `${this.keycloakOIDCPath}` + `token`,
          queryString.stringify(params),
          this.getContentType()
        )
        .pipe(
          map((res) => {
            return new KeycloakToken(
              res.data.access_token,
              res.data.refresh_token,
              res.data.expires_in,
              res.data.refresh_expires_in
            );
          }),
          catchError((e) => {
            throw new HttpException(e.response.data, e.response.status);
          }),
          concatMap(async (token) => {
            type Payload = {
              sub: string;
              email: string;
              preferred_username: string;
              email_verified: boolean;
            };
            const decodedToken = this.jwtService.decode(
              token.access_token
            ) as Payload;
            const { email, preferred_username } = decodedToken;
            const user = await this.userEmailService.findByEmail(email);
            if (!user) {
              this.userService.create({
                email,
                isVerified: true,
                username: preferred_username,
              });
            } else {
              if (!user.isVerified) {
                user.isVerified = true;
                await user.save();
              }
            }
            const session = this.getSession(user, decodedToken);
            this.setToken(session, token.access_token);
            this.sessionRefreshToken.set(session, token.refresh_token);
            return session;
          })
        )
    );

    return session;
  }

  getSession(user: UserEmail, token: { [key: string]: unknown }) {
    const session = randomUUID();
    this.sessionMap.set(session, token);
    return session;
  }

  setToken(session: string, token: string) {
    this.sessionToken.set(session, token);
  }

  getTokenFromSession(id: string) {
    return this.sessionMap.get(id);
  }

  getEncodedTokenFromSession(id: string) {
    return this.sessionToken.get(id);
  }

  refreshAccessToken(refresh_token: string) {
    const params = {
      grant_type: 'refresh_token',
      client_id: this.keycloakClientId,
      client_secret: this.keycloakClientSecret,
      refresh_token: refresh_token,
      redirect_uri: this.keycloakRedirectUri,
    };

    return this.httpService
      .post(
        `${this.keycloakOIDCPath}` + `token`,
        queryString.stringify(params),
        this.getContentType()
      )
      .pipe(
        map(
          (res) =>
            new KeycloakToken(
              res.data.access_token,
              res.data.refresh_token,
              res.data.expires_in,
              res.data.refresh_expires_in
            )
        ),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        })
      );
  }

  async logout(session: string) {
    const refresh_token = this.sessionRefreshToken.get(session);
    const params = {
      client_id: this.keycloakClientId,
      client_secret: this.keycloakClientSecret,
      refresh_token: refresh_token,
    };
    return await firstValueFrom(
      this.httpService
        .post(
          `${this.keycloakOIDCPath}` + `logout`,
          queryString.stringify(params),
          this.getContentType()
        )
        .pipe(
          map((res) => res.data),
          catchError((e) => {
            throw new HttpException(e.response.data, e.response.status);
          })
        )
    );
  }

  getContentType() {
    return { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
  }
}
