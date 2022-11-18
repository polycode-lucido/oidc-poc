import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  RunnerOptions,
  RunnerProvider,
  RUNNER_OPTIONS,
} from '../runner-provider.model';
import * as fs from 'node:fs';
import * as process from 'node:child_process';
import { randomUUID } from 'node:crypto';
import {
  RunnerLanguages,
  RunnerExecutionResults,
  RunnerLanguagesSettings,
} from '@polycode/runner-consumer';

@Injectable()
export class ForkStrategyService implements RunnerProvider {
  constructor(
    @Inject(RUNNER_OPTIONS) private readonly runnerOptions: RunnerOptions
  ) {
    this.runnerOptions = runnerOptions;
  }

  /**
   * It takes in a source code string and a language, and returns a promise that resolves to a
   * RunnerExecutionResults object
   * @param {string} sourceCode - The source code to be executed.
   * @param {RunnerLanguages} language - RunnerLanguages
   * @returns The results of the execution of the code.
   */
  async run(
    sourceCode: string,
    language: RunnerLanguagesSettings,
    stdin: string[]
  ): Promise<RunnerExecutionResults> {
    switch (language.language) {
      case RunnerLanguages.Python:
        return { ...(await this.runPython(sourceCode, stdin)) };
      case RunnerLanguages.Java:
        return { ...(await this.runJava(sourceCode, stdin)) };
      case RunnerLanguages.Rust:
        return { ...(await this.runRust(sourceCode, stdin)) };
      case RunnerLanguages.Node:
        return { ...(await this.runNode(sourceCode, stdin)) };
    }
  }

  /**
   * It writes the source code to a file, then runs it with Node.js
   * @param {string} sourceCode - The source code to run.
   * @returns The return value is an object with three properties: stdout, stderr, and exitCode.
   */
  private async runNode(
    sourceCode: string,
    stdin: string[]
  ): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    const filename = this.writeSourceCode(sourceCode, 'mjs');
    return this.exec('node', stdin, [filename]);
  }

  /**
   * It writes the source code to a file, then runs the Python interpreter on that file
   * @param {string} sourceCode - The source code to run.
   * @returns an object with three properties: stdout, stderr, and exitCode.
   */
  private async runPython(
    sourceCode: string,
    stdin: string[]
  ): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    const filename = this.writeSourceCode(sourceCode, 'py');
    return this.exec('python3', stdin, [filename]);
  }

  /**
   * It writes the source code to a file, then executes the Java compiler and run that file
   * @param {string} sourceCode - The source code to be compiled and run.
   * @returns an object with three properties: stdout, stderr, and exitCode.
   */
  private async runJava(
    sourceCode: string,
    stdin: string[]
  ): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    const filename = this.writeSourceCode(sourceCode, 'java');
    return this.exec('java', stdin, [filename]);
  }

  /**
   * It compiles the source code using the `rustc` compiler, and then executes the binary file
   * @param {string} sourceCode - The source code to be compiled and executed.
   * @returns An object with the stdout, stderr, and exitCode of the execution of the rust binary.
   */
  private async runRust(
    sourceCode: string,
    stdin: string[]
  ): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    const filename = this.writeSourceCode(sourceCode, 'rs');
    const binaryFile = filename.slice(0, -3);
    const compiler = await this.exec(
      'rustc',
      stdin,
      [filename, '-o', binaryFile],
      false
    );

    if (compiler.exitCode !== 0) {
      return compiler;
    }

    const execution = await this.exec(binaryFile, stdin);
    this.deleteSourceCode([filename, binaryFile]);
    return execution;
  }

  /**
   * It writes the source code to a temporary file and returns the filename
   * @param {string} sourceCode - The source code to be compiled.
   * @param {string} [extension] - The file extension of the source code.
   * @returns The filename of the file that was written to the /tmp directory.
   */
  private writeSourceCode(sourceCode: string, extension?: string): string {
    const uuid = randomUUID();
    const filename = `/tmp/${uuid + (extension ? '.' + extension : '')}`;
    const file = fs.openSync(filename, 'w');
    fs.writeSync(file, sourceCode);
    return filename;
  }

  /**
   * It deletes the source code files that were created by the compiler
   * @param {string[]} filename - The name of the file to be deleted.
   */
  private deleteSourceCode(filename: string[]): void {
    if (filename) {
      filename.forEach((file) => {
        fs.unlink(file, (err) => {
          if (err) Logger.error(err);
        });
      });
    }
  }

  /**
   * It spawns a child process, and returns a promise that resolves to an object containing the stdout,
   * stderr, and exit code of the child process
   * @param {string} binary - The binary to run.
   * @param {string[]} [options] - The options to pass to the compiler.
   * @param [deleteFiles=true] - If true, the source code will be deleted after the execution.
   * @returns A promise that resolves to an object with stdout, stderr, and exitCode properties.
   */
  private async exec(
    binary: string,
    stdin: string[],
    options?: string[],
    deleteFiles = true
  ): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    let stdout = '';
    let stderr = '';

    const child = process.spawn(binary, options);

    child.stdin.write(stdin.join('\n') + '\n');

    child.stdout.on('data', (data) => {
      stdout += data;
    });
    child.stderr.on('data', (data) => {
      stderr += data;
    });

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        if (deleteFiles) {
          this.deleteSourceCode(options);
        }
        child.kill();
        resolve({ stdout, stderr, exitCode: -128 });
      }, this.runnerOptions.timeout);

      child.on('exit', (exitCode, signal) => {
        if (signal !== 'SIGTERM') {
          if (deleteFiles) {
            this.deleteSourceCode(options);
          }
          clearTimeout(timeout);
          resolve({
            stdout,
            stderr,
            exitCode,
          });
        }
      });
    });
  }
}
