import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ResponseFormatter } from '@polycode/response-formatter';
import {
  ApiBearerAuth,
  ApiBody,
  ApiBodyOptions,
  ApiForbiddenResponse,
  ApiOperation,
  ApiOperationOptions,
  ApiParam,
  ApiParamOptions,
  ApiResponse,
  ApiResponseOptions,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Filter,
  FilterOptionsArrays,
  FilterOptionsKeys,
  Order,
  OrderKeys,
  Pagination,
} from '@polycode/request-helper';

interface ApiRouteOptions {
  operation?: ApiOperationOptions;
  response?: ApiResponseOptions;
  params?: ApiParamOptions[];
  body?: ApiBodyOptions;
  others?: (MethodDecorator & ClassDecorator)[];
  pagination?: boolean;
  order?: {
    enable: boolean;
    keys: OrderKeys;
  };
  filter?: {
    enable: boolean;
    keys?: FilterOptionsKeys;
    arrays?: FilterOptionsArrays;
  };
}

export const ApiRoute = (options: ApiRouteOptions = {}) =>
  applyDecorators(
    ...((options.operation && [ApiOperation(options.operation)]) || []),
    ...((options.response && [
      ApiResponse(
        ResponseFormatter.formatApiResponseOptions(options.response, {
          ...(options.pagination && {
            pagination: {
              type: 'object',
              required: ['page', 'limit'],
              properties: {
                page: {
                  type: 'number',
                  description: 'Page number for pagination',
                },
                limit: {
                  type: 'number',
                  description: 'Number of item per page for pagination',
                },
                total: {
                  type: 'number',
                  description: 'Total number of items',
                },
              },
            },
          }),
          ...(options.order?.enable && {
            'order-by': {
              type: 'object',
              required: ['keys'],
              properties: {
                keys: {
                  type: 'object',
                  properties: Object.keys(options.order.keys ?? []).reduce(
                    (acc, key) => ({
                      ...acc,
                      [key]: {
                        type: 'string',
                        enum: ['asc', 'desc'],
                        description: `Order results by ${key} (optional)`,
                      },
                    }),
                    {}
                  ),
                },
              },
            },
          }),
          ...(options.filter && {
            filter: {
              type: 'object',
              properties: {
                keys: {
                  type: 'object',
                  properties: Object.keys(options.filter.keys || []).reduce(
                    (acc, key) => ({
                      ...acc,
                      [key]: {
                        type: 'string',
                        enum: options.filter.keys[key].values?.length
                          ? options.filter.keys[key].values
                          : undefined,
                        description: `Filter results by ${key}`,
                      },
                    }),
                    {}
                  ),
                },
                arrays: {
                  type: 'object',
                  properties: Object.keys(options.filter.arrays || []).reduce(
                    (acc, key) => ({
                      ...acc,
                      [key]: {
                        type: 'string',
                        description: `Filter results by ${key}`,
                      },
                    }),
                    {}
                  ),
                },
              },
            },
          }),
        })
      ),
    ]) ||
      []),
    ...((options.body && [ApiBody(options.body)]) || []),
    ...(options.params || []).map((param) => ApiParam(param)),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error occurred',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Bad request error occurred',
    }),
    ...(options.others || []),
    ...((options.pagination && [Pagination()]) || []),
    ...((options.order?.enable && [Order(options.order)]) || []),
    ...((options.filter?.enable && [Filter(options.filter)]) || [])
  );

export const ApiRouteAuthenticated = (options: ApiRouteOptions = {}) =>
  applyDecorators(
    ApiBearerAuth(),
    ApiForbiddenResponse({
      description: 'Forbidden access to the requested resource',
    }),
    ApiUnauthorizedResponse({
      description: 'Authorization properties are missing from the request',
    }),
    ApiRoute(options)
  );
