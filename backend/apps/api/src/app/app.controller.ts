import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiRoute } from '@polycode/docs';
import { Unprotected } from 'nest-keycloak-connect';

@Controller()
@ApiTags('Application')
export class AppController {
  @Get('/health')
  @Unprotected()
  @ApiRoute({
    operation: {
      summary: 'Get the health of the application',
    },
    response: {
      status: 200,
      description:
        'Returns the health of the service. Status will be "ok" and response code will be "200" if everything is fine',
      schema: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            description: 'Status of the service',
            enum: ['ok'],
          },
        },
      },
    },
  })
  health() {
    return { status: 'ok' };
  }
}
