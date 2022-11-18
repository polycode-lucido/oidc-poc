import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Application')
export class AppController {
  @Get('/health')
  @ApiOperation({
    summary: 'Get the health of the runner',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns the health of the service. Status will be "ok" and response code will be "200" if everything is fine',
    schema: {
      type: 'object',
      required: ['status'],
      properties: {
        status: {
          type: 'string',
          description: 'The health of the service',
        },
      },
    },
  })
  health() {
    return { status: 'ok' };
  }
}
