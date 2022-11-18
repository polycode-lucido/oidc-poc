import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ContentService } from '@polycode/content';
import { User } from '@polycode/shared';
import { is404, to500 } from '@polycode/to';
import { UserService } from '@polycode/user';
import { Model, ObjectId } from 'mongoose';
import { Module, ModuleDocument } from '@polycode/shared';
import { CreateModuleDto } from './templates/dto/create-module.dto';
import { UpdateModuleDto } from './templates/dto/update-module.dto';
import { OrderKeys } from '@polycode/request-helper';

@Injectable()
export class ModuleService {
  constructor(
    @InjectModel(Module.name)
    private moduleModel: Model<ModuleDocument>,
    private readonly contentService: ContentService,
    private userService: UserService
  ) {}

  /**
   * Convert an array of strings to an array of ObjectIds
   * @param {string[]} uuids - string[] - An array of uuids that you want to convert to ObjectIds
   * @returns An array of ObjectIds
   */
  async fromUuidToObjectId(uuids: string[]): Promise<ObjectId[]> {
    if (!uuids) {
      return [];
    }

    const promises = uuids.map((id) => this.findOneById(id));

    return (await Promise.all(promises)).map(
      (module) => module._id as ObjectId
    );
  }

  /**
   * Creates a new module document in the database
   * @param {CreateModuleDto} createModuleDto - CreateModuleDto
   * @returns A ModuleDocument
   */
  async create(createModuleDto: CreateModuleDto, authorId: string) {
    const modules: ObjectId[] = await this.fromUuidToObjectId(
      createModuleDto.modules
    );

    const contents: ObjectId[] = await this.contentService.fromUuidToObjectId(
      createModuleDto.contents
    );

    const moduleTemplate = { ...createModuleDto, modules, contents, authorId };

    return await to500<ModuleDocument>(this.moduleModel.create(moduleTemplate));
  }

  /**
   * Find all modules, and populate the exercises and course fields.
   * @param {number} offset - offset
   * @param {number} limit - limit
   * @param {Record<string, unknown>} findOptions - a mongo-like find object
   * @param {OrderKeys} order - a sorting object
   * @returns An array of ModuleDocument objects.
   */
  async findAll(
    offset?: number,
    limit?: number,
    findOptions?: Record<string, unknown>,
    order?: OrderKeys
  ) {
    return await to500<ModuleDocument[]>(
      this.moduleModel
        .find(findOptions)
        .skip(offset)
        .limit(limit)
        .sort(order)
        .populate({
          path: 'modules contents',
          select: 'id -_id',
        })
        .exec()
    );
  }

  /**
   * It returns a 404 error if the module with the given id is not found, otherwise it returns the
   * module
   * @param {string} id - string - the id of the module we want to find
   * @returns A module document
   */
  async findOneById(id: string) {
    return await is404<ModuleDocument>(
      this.moduleModel.findOne({ id: id }).populate('modules contents').exec()
    );
  }

  /**
   * It takes an id and an updateModuleDto, and returns a promise that resolves to a ModuleDocument or
   * a 404 error
   * @param {string} id - string - The id of the module to update
   * @param {UpdateModuleDto} updateModuleDto - UpdateModuleDto
   * @returns The updated module
   */
  async update(id: string, updateModuleDto: UpdateModuleDto) {
    const modules: ObjectId[] = await this.fromUuidToObjectId(
      updateModuleDto.modules
    );

    const contents: ObjectId[] = await this.contentService.fromUuidToObjectId(
      updateModuleDto.contents
    );

    const moduleTemplate = { ...updateModuleDto, modules, contents };

    await is404<ModuleDocument>(
      this.moduleModel.findOneAndUpdate({ id: id }, moduleTemplate).exec()
    );

    return this.findOneById(id);
  }

  /**
   * It removes a module from the database
   * @param {string} id - string - The id of the module to remove
   */
  async remove(id: string) {
    await to500(this.moduleModel.deleteOne({ id: id }).exec());
  }

  async format(module: Module | Module[]): Promise<Module[] | Partial<Module>> {
    if (Array.isArray(module)) {
      const modules = module.map(
        (module) => this.format(module) as Promise<Module>
      );
      return Promise.all(modules);
    }

    const data = module.data;
    data._id = null;

    let author: User;

    if (module.authorId) {
      author = this.userService.format(
        await this.userService._findById(module.authorId, { validator: to500 })
      ) as User;
    }

    return {
      id: module.id,
      name: module.name,
      description: module.description,
      type: module.type,
      reward: module.reward,
      tags: module.tags,
      data,
      modules: module.modules,
      contents: this.contentService.format(module.contents),
      author,
    };
  }
}
