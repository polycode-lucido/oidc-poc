import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEmailService, UserService } from '@polycode/user';
import { IsJWT, IsNumber } from 'class-validator';
import * as queryString from 'querystring';
import { catchError, map, tap } from 'rxjs';

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
  private keycloakUri: string;
  private keycloakOIDCPath: string;
  private keycloakResponseType: string;
  private keycloakScope: string;
  private keycloakRedirectUri: string;
  private keycloakClientId: string;
  private keycloakClientSecret: string;
  // private keycloakLogoutUri: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly userEmailService: UserEmailService
  ) {
    this.keycloakUri = 'http://localhost:8080/';
    this.keycloakOIDCPath = 'realms/polycode/protocol/openid-connect/';
    this.keycloakResponseType = 'code';
    this.keycloakScope = 'profile';
    this.keycloakRedirectUri = 'http://localhost:3001/sign-in';
    this.keycloakClientId = 'polycode-api';
    this.keycloakClientSecret = '3jnsa9opY8drhWev983MujCmyFrp3aRP';
    //this.keycloakLogoutUri = this._config.get('KEYCLOAK_LOGOUT_URI');
  }

  getUrlLogin(): string {
    return (
      `${this.keycloakUri}` +
      `${this.keycloakOIDCPath}` +
      `auth` +
      `?client_id=${this.keycloakClientId}` +
      `&response_type=${this.keycloakResponseType}` +
      `&scope=${this.keycloakScope}` +
      `&redirect_uri=${queryString.escape(this.keycloakRedirectUri)}`
    );
  }

  getAccessToken(code: string) {
    const params = {
      grant_type: 'authorization_code',
      client_id: this.keycloakClientId,
      client_secret: this.keycloakClientSecret,
      code,
      redirect_uri: this.keycloakRedirectUri,
    };

    return this.httpService
      .post(
        `${this.keycloakUri}` + `${this.keycloakOIDCPath}` + `token`,
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
        tap(async (token) => {
          type Payload = {
            sub: string;
            email: string;
            preferred_username: string;
            email_verified: boolean;
          };
          const { email, preferred_username } = this.jwtService.decode(
            token.access_token
          ) as Payload;
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
        })
      );
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
        `${this.keycloakUri}` + `${this.keycloakOIDCPath}` + `token`,
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

  logout(refresh_token: string) {
    const params = {
      client_id: this.keycloakClientId,
      client_secret: this.keycloakClientSecret,
      refresh_token: refresh_token,
    };
    return this.httpService
      .post(
        `${this.keycloakUri}` + `${this.keycloakOIDCPath}` + `logout`,
        queryString.stringify(params),
        this.getContentType()
      )
      .pipe(
        map((res) => res.data),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        })
      );
  }

  getContentType() {
    return { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
  }
}
