import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@polycode/user';
import { registerer, validationSchema } from './auth.config';
import { AuthController } from './auth.controller';
import { AuthMiddleware } from './middleware/auth.middleware';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [registerer], validationSchema }),
    JwtModule.register({ secret: process.env.AUTH_JWT_SECRET }),
    HttpModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthMiddleware],
  exports: [AuthService, AuthMiddleware],
})
export class AuthProviderModule {}
