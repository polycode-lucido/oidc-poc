import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import {
  makeCounterProvider,
  makeHistogramProvider,
  PrometheusModule as WillsotoPrometheusModule,
} from '@willsoto/nestjs-prometheus';
import {
  HTTP_EXCEPTIONS_METRIC_NAME,
  HTTP_REQUESTS_METRIC_NAME,
} from './prometheus.constant';
import { PrometheusCatchAllExceptionsFilter } from './filters/exceptions.filter';
import { InboundMiddleware } from './middlewares/inbound.middleware';

@Module({
  imports: [WillsotoPrometheusModule.register()],
  providers: [
    makeCounterProvider({
      name: HTTP_EXCEPTIONS_METRIC_NAME,
      help: 'Number of HTTP exceptions with the given status code and path',
      labelNames: ['method', 'status', 'path'],
    }),
    {
      provide: APP_FILTER,
      useClass: PrometheusCatchAllExceptionsFilter,
    },
    makeHistogramProvider({
      name: HTTP_REQUESTS_METRIC_NAME,
      help: 'HTTP requests - Duration in seconds',
      labelNames: ['method', 'status', 'path'],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 10],
    }),
  ],
})
export class PrometheusModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InboundMiddleware).forRoutes('*');
  }
}
