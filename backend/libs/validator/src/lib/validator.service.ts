import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { is404, to500 } from '@polycode/to';
import { Model } from 'mongoose';
import { CreateValidatorDto } from './templates/dtos/create-validator.dto';
import { UpdateValidatorDto } from './templates/dtos/update-validator.dto';
import { Validator, ValidatorDocument } from '@polycode/shared';

@Injectable()
export class ValidatorService {
  constructor(
    @InjectModel(Validator.name)
    private readonly validatorModel: Model<ValidatorDocument>
  ) {}

  /**
   * Create a new validator
   * @param createValidatorDto
   * @returns the created validator
   */
  async create(createValidatorDto: CreateValidatorDto) {
    const validator = await to500<Validator>(
      this.validatorModel.create(createValidatorDto)
    );
    delete validator._id;
    return validator;
  }

  /**
   * Get all validators
   * @returns all validators
   */
  async findAll() {
    return await to500<Validator[]>(
      this.validatorModel.find({}, { _id: 0 }).exec()
    );
  }

  /**
   * Get a validator by id
   * @param id
   * @returns the validator
   */
  async findOne(id: string) {
    return await is404<Validator>(
      this.validatorModel.findOne({ id }, { _id: 0 }).exec()
    );
  }

  /**
   * Get a validator by _id
   * @param id
   * @returns the validator
   */
  async findByObjectId(_id) {
    return await is404<Validator>(
      this.validatorModel.findById(_id, { _id: 0 }).exec()
    );
  }

  /**
   * Update a validator
   * @param id
   * @param updateValidatorDto
   * @returns the updated validator
   */
  async update(id: string, updateValidatorDto: UpdateValidatorDto) {
    return await is404(
      this.validatorModel
        .findOneAndUpdate({ id }, updateValidatorDto, { _id: 0, new: true })
        .exec()
    );
  }

  /**
   * Delete a validator
   * @param id
   */
  async remove(id: string) {
    await is404(this.validatorModel.findOneAndDelete({ id }).exec());
  }

  /**
   * It removes the `_id` and `__v` properties from a validator
   * @param {Validator} validator - The validator to remove the id and __v from.
   * @returns The validator without the _id and __v properties.
   */
  format(validator: Validator | Validator[]) {
    if (Array.isArray(validator)) {
      return validator.map((validator) => this.format(validator));
    }
    delete validator._id;
    delete validator.__v;
    return validator;
  }
}
