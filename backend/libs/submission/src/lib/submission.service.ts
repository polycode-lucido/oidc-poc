import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { is404, to500 } from '@polycode/to';
import { RunnerLanguagesSettings } from '@polycode/runner-consumer';
import {
  AttemptData,
  Submission,
  SubmissionDocument,
} from './submission.entity';
import { SubmissionDTO } from './templates/dtos/submission.dto';
import { ValidatorService } from '@polycode/validator';
import { RunnerConsumerService } from '@polycode/runner-consumer';
import { ComponentService } from '@polycode/component';
import { SubmissionOneDTO } from './templates/dtos/submissionOne.dto';
import { UserService } from '@polycode/user';
import { Content, User } from '@polycode/shared';
import { ContentService } from '@polycode/content';

/**
 * `CodeResult` is an object that contains the result of a code execution.
 * @property {string} stdout - The output of the code that was run.
 * @property {string} stderr - The error output of the command.
 * @property {number} exitCode - The exit code of the process.
 */
type CodeResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
};

@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Submission.name)
    private submissionModel: Model<SubmissionDocument>,
    private validatorService: ValidatorService,
    private runnerConsumerService: RunnerConsumerService,
    private componentService: ComponentService,
    private userService: UserService,
    private contentService: ContentService
  ) {}

  /**
   * Sumbit code , and run it with all validators of the component. Save attempt data in the database.
   * @param {string} userId - The id of the user who submitted the code.
   * @param {SubmissionDTO} submissionDTO - {
   */
  public async submit(userId: string, submissionDTO: SubmissionDTO) {
    const componentId = submissionDTO.componentId;

    const component = await this.componentService.findOnePopulateValidators(
      componentId
    );

    let submission = await this.findOneByUserIdAndComponent(
      userId,
      componentId
    );
    // if submission for this component and user not exist
    // create it , else update lastAttempt
    if (!submission) {
      const newSubmission = {
        userId,
        componentId: componentId,
        lastAttempt: {
          at: `${new Date().getTime()}`,
          data: {
            code: submissionDTO.code,
            language: submissionDTO.language,
            version: submissionDTO?.version,
          },
        },
      };
      submission = await this.create(newSubmission);
    } else {
      const newAttempt = {
        language: submissionDTO.language,
        version: submissionDTO?.version,
        code: submissionDTO.code,
      };
      this.updateLastAttempt(submission.id, newAttempt);
    }

    const validators = component.data.validators;
    // if component doesn't have validators , return false
    if (!validators) {
      return {
        success: false,
      };
    }

    // run code with each validators in promise , if test passed return true
    //else return CodeResult (stderr & stdout)
    const runningInstances = [];
    const languageSettings: RunnerLanguagesSettings = {
      version: submissionDTO?.version,
      language: submissionDTO.language,
    };

    validators.map((validator) => {
      runningInstances.push(
        new Promise((resolve) => {
          this.runnerConsumerService
            .run({
              sourceCode: submissionDTO.code,
              stdin: validator.input.stdin,
              settings: languageSettings,
            })
            .then((result) => {
              const codeResult: CodeResult = result.data;
              // if error occurs during run, reject
              if (codeResult.exitCode) {
                return resolve({
                  success: false,
                  validator: validator.id,
                });
              }
              if (
                this.checkOutput(codeResult.stdout, validator.expected.stdout)
              ) {
                resolve({
                  success: true,
                  validator: validator.id,
                });
              } else {
                resolve({
                  success: false,
                  validator: validator.id,
                });
              }
            });
        })
      );
    });
    const validatorResult = await to500(Promise.all(runningInstances));
    const allTestSucceeded = validatorResult.every((result) => result.success);
    if (allTestSucceeded) {
      if (!submission?.lastSuccess) {
        const content = await this.contentService.findOne(
          submissionDTO.contentId
        );
        // check if the component is in the content bc user can send content more easy from
        // another content and win points
        if (await this.componentIsInContent(componentId, content)) {
          const userData: User = await this.userService._findById(userId);

          await this.userService._updateInstance(userData, {
            points: userData.points + content.reward,
          });
        }
      }
      const newSuccess = {
        language: submissionDTO.language,
        version: submissionDTO?.version,
        code: submissionDTO.code,
      };
      await this.updateLastSuccess(submission.id, newSuccess);
    }
    return {
      success: allTestSucceeded,
      validators: validatorResult,
    };
  }

  /**
   * Run code only with the validator ( not save in the database )
   * @param {string} validatorId - The id of the validator you want to submit to.
   * @param {SubmissionOneDTO} submissionDTO - SubmissionOneDTO
   * @returns A promise that resolves to an object with two properties: success and codeResult.
   */
  public async submitOne(validatorId: string, submissionDTO: SubmissionOneDTO) {
    const validator = await this.validatorService.findOne(validatorId);
    const languageSettings: RunnerLanguagesSettings = {
      version: submissionDTO?.version,
      language: submissionDTO.language,
    };

    return this.runnerConsumerService
      .run({
        sourceCode: submissionDTO.code,
        stdin: validator.input.stdin,
        settings: languageSettings,
      })
      .then((result) => {
        const codeResult: CodeResult = result.data;

        if (codeResult.exitCode) {
          return {
            success: false,
            codeResult,
          };
        }

        if (this.checkOutput(codeResult.stdout, validator.expected.stdout)) {
          return {
            success: true,
            codeResult,
          };
        } else {
          return {
            success: false,
            codeResult,
          };
        }
      });
  }

  /**
   * "Create a new submission in the database."
   * @param submission - Partial<Submission>
   * @returns A promise of a submission
   */
  public async create(submission: Partial<Submission>): Promise<Submission> {
    return await to500(this.submissionModel.create(submission));
  }

  /**
   * It returns a submission if it exists, otherwise it throws a 404 error
   * @param {string} submissionId - The id of the submission you want to find.
   * @returns A promise of a submission
   */
  public async findOne(submissionId: string): Promise<Submission> {
    return await is404(this.submissionModel.findById(submissionId).exec());
  }

  /**
   * It updates a submission with the given id with the given update
   * @param {string} submissionId - The id of the submission you want to update.
   * @param update - Partial<Submission>
   * @returns The updated submission
   */
  public async update(submissionId: string, update: Partial<Submission>) {
    return await is404(
      this.submissionModel.findOneAndUpdate({ id: submissionId }, update).exec()
    );
  }

  /**
   * It updates the lastAttempt property of the submission document with the current time and the
   * attemptData
   * @param {string} submissionId - The id of the submission you want to update.
   * @param {AttemptData} attemptData - The data of the attempt (code , langage , version)
   */
  public async updateLastAttempt(
    submissionId: string,
    attemptData: AttemptData
  ) {
    this.update(submissionId, {
      lastAttempt: {
        at: `${new Date().getTime()}`,
        data: attemptData,
      },
    });
  }

  /**
   * It updates the lastSuccess property of the submission document with the current timestamp and the
   * attemptData
   * @param {string} submissionId - The id of the submission you want to update.
   * @param {AttemptData} attemptData - The data of the attempt (code , langage , version)
   */
  public async updateLastSuccess(
    submissionId: string,
    attemptData: AttemptData
  ) {
    this.update(submissionId, {
      lastSuccess: {
        at: `${new Date().getTime()}`,
        data: attemptData,
      },
    });
  }

  /**
   * It deletes a submission by its id
   * @param {string} submissionId - The id of the submission to delete.
   */
  public async delete(submissionId: string): Promise<void> {
    await to500(this.submissionModel.findByIdAndDelete(submissionId).exec());
  }

  /**
   * It finds a submission by userId and componentId
   * @param {string} userId - The userId of the user who submitted the component
   * @param {string} componentId - The id of the component that the user is submitting to.
   * @returns A submission object
   */
  public async findOneByUserIdAndComponent(
    userId: string,
    componentId: string
  ): Promise<Submission> {
    return this.submissionModel
      .findOne({ userId, componentId }, { _id: 0 })
      .exec();
  }

  /**
   * It returns the last attempt and last success of a submission
   * @param {string} userId - The user's id
   * @param {string} componentId - The id of the component that the user is submitting to.
   * @returns The lastAttempt and lastSuccess of the submission
   */
  public async getSubmission(userId: string, componentId: string) {
    const submission = await is404(
      this.findOneByUserIdAndComponent(userId, componentId)
    );
    return {
      lastAttempt: submission?.lastAttempt,
      lastSuccess: submission?.lastSuccess,
    };
  }

  /**
   * It checks if the output of the program is the same as the expected output
   * @param {string} output - The output of the code
   * @param {string[]} expected - The expected output of the code.
   * @returns A boolean value.
   */
  private checkOutput(output: string, expected: string[]) {
    const outputLines = output.split('\n');

    return (
      // The '-1' is to remove the last empty line
      outputLines.length - 1 === expected.length &&
      expected.every((line, index) => {
        return line.trim() === outputLines[index].trim();
      })
    );
  }

  /**
   * "Check if a component is in a content."
   * The function takes two parameters:
   * - `componentId`: The id of the component to check.
   * - `content`: The content to check
   * @param {string} componentId - The id of the component you want to check if it's in the content
   * @param {Content} content - Content - The content object that you want to check if the component is
   * in.
   * @returns A boolean value.
   */
  async componentIsInContent(
    componentId: string,
    content: Content
  ): Promise<boolean> {
    const container = await this.componentService.findOne(
      content.rootComponent.id
    );
    return container.data.components.some(
      (component) => component.id === componentId
    );
  }
}
