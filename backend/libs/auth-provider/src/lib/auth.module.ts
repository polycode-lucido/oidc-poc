import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@polycode/user';
import {
  AuthGuard,
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
} from 'nest-keycloak-connect';
import { AuthConfigService, registerer, validationSchema } from './auth.config';
import { AuthController } from './auth.controller';
import { AuthMiddleware } from './auth.middleware';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [registerer],
      validationSchema,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule.forRoot({ load: [registerer], validationSchema })],
      useClass: AuthConfigService,
    }),
    KeycloakConnectModule.registerAsync({
      imports: [ConfigModule.forRoot({ load: [registerer], validationSchema })],
      useClass: AuthConfigService,
    }),
    HttpModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthMiddleware,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
  exports: [AuthService, AuthMiddleware],
})
export class AuthProviderModule {}
