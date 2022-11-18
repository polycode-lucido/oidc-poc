import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { HTTP_EXCEPTIONS_METRIC_NAME } from '../prometheus.constant';
import { getBaseUrl } from '../utils/url';

@Catch(HttpException)
export class PrometheusCatchAllExceptionsFilter extends BaseExceptionFilter {
  constructor(
    @InjectMetric(HTTP_EXCEPTIONS_METRIC_NAME) private counter: Counter<string>
  ) {
    super();
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    this.counter.inc({
      method: request.method,
      status: status,
      path: getBaseUrl(request.baseUrl || request.url),
    });

    super.catch(exception, host);
  }
}
