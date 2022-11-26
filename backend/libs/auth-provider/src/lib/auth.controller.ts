import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Unprotected } from 'nest-keycloak-connect';
import { AuthService, KeycloakToken } from './services/auth.service';

@Controller('auth')
@ApiTags('Authentification')
export class AuthController {
  constructor(
    private readonly axios: HttpService,
    private readonly authService: AuthService
  ) {}

  @Unprotected()
  @Get('login')
  login(@Res() res) {
    res.status(HttpStatus.MOVED_PERMANENTLY);
    res.redirect(this.authService.getUrlLogin());
  }

  @Get('callback')
  @Unprotected()
  getAccessToken(@Query('code') code: string) {
    return this.authService.getAccessToken(code);
  }

  @Post('token')
  @Unprotected()
  refreshAccessToken(@Body() token: KeycloakToken) {
    return this.authService.refreshAccessToken(token.refresh_token);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Body() token: KeycloakToken) {
    return this.authService.logout(token.refresh_token);
  }
}
