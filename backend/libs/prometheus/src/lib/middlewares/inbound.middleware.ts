import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Histogram } from 'prom-client';
import { HTTP_REQUESTS_METRIC_NAME } from '../prometheus.constant';
import { normalizeStatusCode } from '../utils/normalizer';
import { getBaseUrl } from '../utils/url';
import * as responseTime from 'response-time';

@Injectable()
export class InboundMiddleware implements NestMiddleware {
  constructor(
    @InjectMetric(HTTP_REQUESTS_METRIC_NAME)
    private histogram: Histogram<string>
  ) {}

  use(req, res, next) {
    responseTime((req, res, time) => {
      const { url, method } = req;
      const path = getBaseUrl(url);
      if (path === '/favicon.ico' || path === '/metrics') {
        return;
      }

      const status = normalizeStatusCode(res.statusCode);
      const labels = { method, status, path };

      this.histogram.observe(labels, time / 1000);
    })(req, res, next);
  }
}
