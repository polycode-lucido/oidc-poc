import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  Request,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { ApiRouteAuthenticated } from '@polycode/docs';
import { QueryOptions } from '@polycode/query-manager';
import { Resource, Scopes } from 'nest-keycloak-connect';
import { ModuleService } from './module.service';
import { CreateModuleDto } from './templates/dto/create-module.dto';
import { UpdateModuleDto } from './templates/dto/update-module.dto';
import { createModuleBodySchema } from './templates/schemas/module/bodies/module.body.create.schema';
import { patchModuleBodySchema } from './templates/schemas/module/bodies/module.body.patch.schema';
import { moduleIdParamSchema } from './templates/schemas/module/params/moduleId.param.schema';
import { moduleResponseSchema } from './templates/schemas/module/responses/module.response.schema';

@ApiTags('Module')
@Controller('module')
@Resource('module')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Create a new module',
    },
    body: {
      schema: createModuleBodySchema,
    },
    response: {
      status: 201,
      description: 'Returns the created module',
      schema: moduleResponseSchema,
    },
  })
  @Post()
  @Scopes('create')
  async create(@Body() createModuleDto: CreateModuleDto, @Request() request) {
    const module = await this.moduleService.create(
      createModuleDto,
      request.authorization.subject.internalIdentifier
    );

    return this.moduleService.format(module);
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Find all modules',
    },
    response: {
      status: 200,
      description: 'Returns all modules',
      schema: {
        type: 'array',
        items: moduleResponseSchema,
      },
    },
    pagination: true,
    order: {
      enable: true,
      keys: {
        name: null,
        reward: null,
      },
    },
    filter: {
      enable: true,
      keys: {
        name: {
          matching: true,
        },
        authorId: {
          matching: false,
        },
      },
      arrays: {
        tags: {
          containsAll: false,
        },
      },
    },
  })
  @Get()
  @Scopes('read')
  async findAll(@Req() request: QueryOptions) {
    const filter = {
      ...Object.keys(request?.filter?.keys || []).reduce(
        (acc, key) => ({
          ...acc,
          [key]: {
            ...(request?.filter?.keys[key].matching
              ? {
                  $regex: request?.filter?.keys[key].value,
                }
              : {
                  $eq: request?.filter?.keys[key].value,
                }),
          },
        }),
        {}
      ),
      ...Object.keys(request?.filter?.arrays || []).reduce(
        (acc, key) => ({
          ...acc,
          [key]: {
            ...(request?.filter?.arrays[key].containsAll
              ? {
                  $all: request?.filter?.arrays[key].value
                    .slice(1, -1)
                    .split(','),
                }
              : {
                  $in: request?.filter?.arrays[key].value
                    .slice(1, -1)
                    .split(','),
                }),
          },
        }),
        {}
      ),
    };

    const modules = await this.moduleService.findAll(
      request?.pagination?.offset,
      request?.pagination?.limit,
      filter,
      request?.order?.keys
    );

    return this.moduleService.format(modules);
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Find a module by id',
    },
    params: [moduleIdParamSchema],
    response: {
      status: 200,
      description: 'Returns the module',
      schema: moduleResponseSchema,
    },
    others: [
      ApiNotFoundResponse({
        description: 'Module not found',
      }),
    ],
  })
  @Get(':moduleId')
  @Scopes('read')
  async findOne(@Param('moduleId') id: string) {
    const module = await this.moduleService.findOneById(id);
    return this.moduleService.format(module);
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Update a module',
    },
    params: [moduleIdParamSchema],
    body: {
      schema: patchModuleBodySchema,
    },
    response: {
      status: 200,
      description: 'Returns the updated module',
      schema: moduleResponseSchema,
    },
    others: [
      ApiNotFoundResponse({
        description: 'Module not found',
      }),
    ],
  })
  @Patch(':moduleId')
  @Scopes('update')
  async update(
    @Param('moduleId') id: string,
    @Body() updateModuleDto: UpdateModuleDto
  ) {
    const module = await this.moduleService.update(id, updateModuleDto);
    return this.moduleService.format(module);
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Delete a module',
    },
    params: [moduleIdParamSchema],
    response: {
      status: 204,
      description: 'Returns no content',
    },
  })
  @Delete(':moduleId')
  @Scopes('delete')
  @HttpCode(204)
  async remove(@Param('moduleId') id: string) {
    await this.moduleService.remove(id);
  }
}
