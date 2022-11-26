import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentModule } from '@polycode/content';
import { ModuleSchema } from '@polycode/shared';
import { UserModule } from '@polycode/user';
import {
  AuthGuard,
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
} from 'nest-keycloak-connect';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Module.name, schema: ModuleSchema }]),
    KeycloakConnectModule.register({
      authServerUrl: 'http://localhost:8080',
      realm: 'polycode',
      clientId: 'polycode-api',
      secret: '3jnsa9opY8drhWev983MujCmyFrp3aRP',
    }),
    UserModule,
    ContentModule,
  ],
  controllers: [ModuleController],
  providers: [
    ModuleService,
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
})
export class ModuleModule {}
