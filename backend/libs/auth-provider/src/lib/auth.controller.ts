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
import { AuthService, KeycloakToken } from './auth.service';
import { Response } from 'express';

@Controller('auth')
@ApiTags('Authentification')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @Unprotected()
  login() {
    return this.authService.getUrlLogin();
  }

  @Get('callback')
  @Unprotected()
  async getAccessToken(
    @Query('code') code: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const session = await this.authService.getAccessToken(code);
    res.cookie('token', session, {
      httpOnly: true,
      path: '/',
      domain: process.env['PUBLIC_API_URL'] || 'localhost',
      secure: true,
      sameSite: 'none',
    });
    return session;
  }

  @Post('token')
  @Unprotected()
  refreshAccessToken(@Body() token: KeycloakToken) {
    return this.authService.refreshAccessToken(token.refresh_token);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      path: '/',
      domain: process.env['PUBLIC_API_URL'] || 'localhost:3000',
      secure: true,
      sameSite: 'none',
    });
    return this.authService.logout(res.req.cookies['token']);
  }
}
