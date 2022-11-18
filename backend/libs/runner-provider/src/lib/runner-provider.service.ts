import { Inject, Injectable } from '@nestjs/common';
import { RunnerLanguagesSettings } from '@polycode/runner-consumer';
import { RunnerProvider } from './runner-provider.model';

@Injectable()
export class RunnerProviderService {
  private runnerProvider: RunnerProvider;

  constructor(
    @Inject('runnerProviderService') runnerProviderService: RunnerProvider
  ) {
    this.runnerProvider = runnerProviderService;
  }

  /**
   * It runs the source code in the language specified
   * @param {string} sourceCode - The code that you want to run.
   * @param {RunnerLanguages} language - The language that the source code is written in.
   * @returns The result of the run.
   */
  async run(
    sourceCode: string,
    language: RunnerLanguagesSettings,
    stdin: string[] = []
  ) {
    return await this.runnerProvider.run(sourceCode, language, stdin);
  }
}
