import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  RunnerLanguages,
  RunnerExecutionResults,
  RunnerLanguagesSettings,
} from '@polycode/runner-consumer';
import * as Docker from 'dockerode';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'node:fs';
import { Stream } from 'node:stream';
import {
  RunnerOptions,
  RunnerProvider,
  RUNNER_OPTIONS,
} from '../runner-provider.model';

@Injectable()
export class DockerStrategyService implements RunnerProvider {
  private docker: Docker;
  private timeout = 15000;
  private images: RunnerLanguagesSettings[];

  constructor(
    @Inject(RUNNER_OPTIONS) private readonly runnerOptions: RunnerOptions
  ) {
    this.docker = runnerOptions.docker.docker;
    this.images = runnerOptions.docker.images;
    if (runnerOptions.timeout) {
      this.timeout = runnerOptions.timeout;
    }
  }

  /**
   * It creates a container, runs the code, and returns the output
   * @param {string} sourceCode - The source code to be executed
   * @param {RunnerLanguages} languageSettings - The language to run the code in.
   * @returns a promise that resolves to an object with the following properties:
   */
  async run(
    sourceCode: string,
    languageSettings: RunnerLanguagesSettings,
    stdin: string[]
  ): Promise<RunnerExecutionResults> {
    try {
      const image = this.images.find(
        (image) =>
          image.language == languageSettings.language &&
          image.version == languageSettings.version
      );

      if (!image) {
        throw new Error(
          `Language ${languageSettings.language} for version ${languageSettings.version} is not supported`
        );
      }

      const folderPath = this.createFolder();
      const filepath = this.writeSourceCode(
        folderPath,
        sourceCode,
        image.language
      );
      const command = this.commandFromLanguage(image.language, filepath);

      const container = await this.docker.createContainer({
        Image: image.image,
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        NetworkDisabled: true,
        WorkingDir: `/app`,
        HostConfig: {
          ReadonlyRootfs: true,
          NetworkMode: 'none',
          Binds: [`${folderPath}:/app`],
          Tmpfs:
            image.language === RunnerLanguages.Rust
              ? {
                  '/tmp': 'rw,exec,nosuid,size=65536k',
                }
              : {},
        },
        OpenStdin: true,
        Tty: false,
        User: 'nobody',
        Cmd: command,
      });

      Logger.log(
        `Starting container ${container.id} for language ${image.language}, version ${image.version}`,
        'DockerStrategyService'
      );
      const stdoutBuffer = [];
      const stderrBuffer = [];

      await container.start();

      container.attach(
        { stream: true, stdout: true, stderr: true, stdin: true },
        (err, stream) => {
          const stderr = new Stream.PassThrough();
          const stdout = new Stream.PassThrough();
          stream.write(stdin.join('\n') + '\n');

          container.modem.demuxStream(stream, stdout, stderr);

          stderr.on('data', (data) => {
            stderrBuffer.push(data);
          });
          stdout.on('data', (data) => {
            stdoutBuffer.push(data);
          });
        }
      );

      const exitCode = await Promise.race([container.wait(), this.timeoutIn()]);
      Logger.debug(
        `Container ${container.id} ended for language ${image.language}`,
        'DockerStrategyService'
      );

      try {
        await container.kill();
      } catch (e) {
        // Ignore already dead container
      } finally {
        await container.remove();
      }

      return {
        stdout: Buffer.concat(stdoutBuffer).toString(),
        stderr: Buffer.concat(stderrBuffer).toString(),
        exitCode: exitCode.StatusCode,
      };
    } catch (error) {
      Logger.error(error);
      throw new Error(error.message);
    }
  }

  /**
   * It creates a random folder in the /tmp directory and returns the path to that folder
   * @returns A string that is the path to a folder that has been created.
   */
  private createFolder(): string {
    const uuid = uuidv4();
    const folder = `/tmp/${uuid}/`;
    fs.mkdirSync(folder);
    return folder;
  }

  /**
   * It writes the source code to a file in the folder, and returns the filename
   * @param {string} folder - The folder where the source code will be written to.
   * @param {string} sourceCode - The source code that you want to write to a file.
   * @param {RunnerLanguages} language - The language that the source code is written in.
   * @returns The filename of the file that was written to disk.
   */
  private writeSourceCode(
    folder: string,
    sourceCode: string,
    language: RunnerLanguages
  ): string {
    const filename = this.filenameFromLanguage(language);
    const path = `${folder}${filename}`;
    const file = fs.openSync(path, 'w');
    fs.writeSync(file, sourceCode);
    return filename;
  }

  /**
   * It takes a language and returns the filename that should be used for that language
   * @param {RunnerLanguages} language - The language of the code to be run.
   * @returns The filename of the file that will be created for the given language.
   */
  private filenameFromLanguage(language: RunnerLanguages): string {
    switch (language) {
      case RunnerLanguages.Java:
        return 'Application.java';
      case RunnerLanguages.Python:
        return 'main.py';
      case RunnerLanguages.Rust:
        return 'main.rs';
      case RunnerLanguages.Node:
        return 'index.js';
      default:
        throw new Error(`Language ${language} is not supported`);
    }
  }

  /**
   * It returns the command to run depending on the language and filepath
   * @param {RunnerLanguages} language - The language that the code is written in.
   * @param {string} filepath - The path to the file that will be executed.
   * @returns The command to run the code.
   */
  private commandFromLanguage(
    language: RunnerLanguages,
    filepath: string
  ): string[] {
    switch (language) {
      case RunnerLanguages.Java:
        return ['java', filepath];
      case RunnerLanguages.Python:
        return ['python', filepath];
      case RunnerLanguages.Rust:
        return ['sh', '-c', `rustc main.rs -o /tmp/main  && /tmp/main`];
      case RunnerLanguages.Node:
        return ['node', filepath];
    }
  }

  /**
   * It returns a promise that resolves to an -128 statusCode with a statusCode property after a timeout
   * @returns A promise that resolves to an -128 statusCode with a statusCode property.
   */
  private timeoutIn(): Promise<{ statusCode: number }> {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ statusCode: -128 }), this.timeout)
    );
  }
}
