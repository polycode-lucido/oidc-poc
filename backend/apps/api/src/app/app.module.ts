import { ModuleModule } from '@polycode/module';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthConsumerModule } from '@polycode/auth-consumer';
import { AuthMiddleware, AuthProviderModule } from '@polycode/auth-provider';
import { MailerConsumerModule } from '@polycode/mailer-consumer';
import { ComponentModule } from '@polycode/component';
import { ContentModule } from '@polycode/content';
import { Environment } from '@polycode/env';
import { ItemModule } from '@polycode/item';
import { UserModule } from '@polycode/user';
import { registerer, validationSchema } from './app.config';
import { AppController } from './app.controller';
import { TeamProviderModule } from '@polycode/team-provider';
import { ValidatorModule } from '@polycode/validator';
import { SubmissionModule } from '@polycode/submission';
import { PrometheusModule } from '@polycode/prometheus';
import { TransactionsModule } from '@polycode/transactions';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [registerer], validationSchema }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      logging:
        process.env.NODE_ENV === Environment.PRODUCTION ? false : console.log,
      host: process.env.AUTH_DATABASE_HOST,
      port: Number(process.env.AUTH_DATABASE_PORT),
      username: process.env.AUTH_DATABASE_USER,
      password: process.env.AUTH_DATABASE_PASSWORD,
      database: process.env.AUTH_DATABASE_NAME,
      ...(process.env.AUTH_DATABASE_SSL === 'true' && {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }),
      pool: {
        max: process.env.NODE_ENV === Environment.PRODUCTION ? 50 : 2,
        min: process.env.NODE_ENV === Environment.PRODUCTION ? 20 : 2,
        idle: 5000,
      },
      define: {
        underscored: true,
      },
      autoLoadModels: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL, {
      auth: {
        username: process.env.MONGODB_USER,
        password: process.env.MONGODB_PASSWORD,
      },
    }),
    AuthProviderModule,
    AuthConsumerModule,
    UserModule,
    ComponentModule,
    ItemModule,
    TransactionsModule,
    MailerConsumerModule.forRoot({}),
    ModuleModule,
    JwtModule.register({ secret: process.env.AUTH_JWT_SECRET }),
    TeamProviderModule,
    ValidatorModule,
    SubmissionModule,
    ContentModule,
    PrometheusModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
