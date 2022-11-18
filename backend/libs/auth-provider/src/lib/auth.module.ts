import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { registerer, validationSchema } from './auth.config';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeModels } from './entities';
import { AuthService } from './services/auth.service';
import { OAuth2Service } from './services/oauth2.service';
import { TokenService } from './services/token.service';
import { ClientService } from './services/client.service';
import { SubjectService } from './services/subject.service';
import { CryptoService } from './services/crypto.service';
import { AuthController } from './auth.controller';
import { CaslModule } from '@polycode/casl';
import { RoleService } from './services/role.service';
import { RolePolicyService } from './services/rolePolicy.service';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [registerer], validationSchema }),
    JwtModule.register({ secret: process.env.AUTH_JWT_SECRET }),
    SequelizeModule.forFeature(sequelizeModels),
    CaslModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    OAuth2Service,
    TokenService,
    ClientService,
    SubjectService,
    RoleService,
    RolePolicyService,
    CryptoService,
  ],
  exports: [AuthService, SubjectService, RoleService, RolePolicyService],
})
export class AuthProviderModule {}
