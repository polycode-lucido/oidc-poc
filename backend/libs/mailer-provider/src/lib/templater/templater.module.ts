import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { registerer, validationSchema } from './templater.config';
import { TemplaterService } from './templater.service';

@Module({
  imports: [ConfigModule.forRoot({ load: [registerer], validationSchema })],
  providers: [TemplaterService],
  exports: [TemplaterService],
})
export class TemplaterModule {}
