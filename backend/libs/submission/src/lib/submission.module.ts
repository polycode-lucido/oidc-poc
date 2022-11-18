import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthConsumerModule } from '@polycode/auth-consumer';
import { ComponentModule } from '@polycode/component';
import { ContentModule } from '@polycode/content';
import { RunnerConsumerModule } from '@polycode/runner-consumer';
import { UserModule } from '@polycode/user';
import { ValidatorModule } from '@polycode/validator';
import { SubmissionController } from './submission.controller';
import { Submission, SubmissionSchema } from './submission.entity';
import { SubmissionService } from './submission.service';
//import { SubmissionService } from './submission.service';
@Module({
  imports: [
    RunnerConsumerModule,
    ValidatorModule,
    MongooseModule.forFeature([
      { name: Submission.name, schema: SubmissionSchema },
    ]),
    AuthConsumerModule,
    ComponentModule,
    UserModule,
    ContentModule,
  ],
  controllers: [SubmissionController],
  providers: [SubmissionService],
  exports: [SubmissionService],
})
export class SubmissionModule {}
