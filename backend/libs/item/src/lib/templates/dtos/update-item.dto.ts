import { PartialType } from '@nestjs/mapped-types';
import CreateItemDTO from './create-item.dto';

export class UpdateItemDTO extends PartialType(CreateItemDTO) {}
