import * as k8s from '@kubernetes/client-node';
import {
  RunnerLanguages,
  RunnerLanguagesSettings,
} from '@polycode/runner-consumer';
import { v4 as uuidv4 } from 'uuid';

export class RunnerJob extends k8s.V1Job {
  /**
   * It returns an instance of a Runner Job
   * @param image - Image to use
   * @param sourceCode - Source code to run
   * @param stdin - Stdin to pass to the program
   */
  constructor(
    image: RunnerLanguagesSettings,
    sourceCode: string,
    stdin: string[]
  ) {
    super();

    this.apiVersion = 'batch/v1';
    this.kind = 'Job';
    this.metadata = new k8s.V1ObjectMeta();
    this.metadata.name = this.generateJobName(image.language);
    this.spec = new k8s.V1JobSpec();
    this.spec.backoffLimit = 0;
    this.spec.template = new k8s.V1PodTemplateSpec();
    this.spec.template.spec = new k8s.V1PodSpec();
    this.spec.template.spec.restartPolicy = 'OnFailure';
    this.spec.template.spec.containers = [new k8s.V1Container()];
    this.spec.template.spec.containers[0].name = 'runner';
    this.spec.template.spec.containers[0].image = image.image;
    this.spec.template.spec.containers[0].command = this.generateCommand(
      image.language,
      sourceCode,
      stdin
    );
  }

  /**
   * It generates a random name for the job
   * @param language - Language used to generate the name
   * @returns - Job name
   */
  private generateJobName(language: RunnerLanguages): string {
    return `runner-${language.toString().toLocaleLowerCase()}-${uuidv4()}`;
  }

  /**
   * It generates the command to run the program base on the language
   * @param language - Language used to generate the command
   * @param code - Source code to run
   * @param stdin - Stdin to pass to the program
   * @returns - Command to execute
   */
  private generateCommand(
    language: RunnerLanguages,
    code: string,
    stdin: string[]
  ): string[] {
    const returnExecutionResults = `
    status="$?"
    echo "$::stdout::$"
    cat /tmp/stdout
    echo "$::end::$"
    echo "$::stderr::$"
    cat /tmp/stderr
    echo "$::end::$"
    return $status`;

    const echoStdin = `
    touch /tmp/stderr
    touch /tmp/stdout
    touch /tmp/stdin
    echo "${stdin
      .join('\n')
      .replaceAll('"', '\\"')
      .replaceAll('`', '\\`')}" > stdin`;

    const echoCode = `
    echo "${code.replaceAll('"', '\\"').replaceAll('`', '\\`')}"`;

    switch (language) {
      case RunnerLanguages.Java:
        return [
          'sh',
          '-c',
          `${echoCode} > Application.java && ${echoStdin} &&
          java Application.java < stdin 1> /tmp/stdout 2> /tmp/stderr && ${returnExecutionResults}`,
        ];
      case RunnerLanguages.Python:
        return [
          'sh',
          '-c',
          `${echoCode} > main.py && ${echoStdin} &&
          python main.py < stdin 1> /tmp/stdout 2> /tmp/stderr && ${returnExecutionResults}`,
        ];
      case RunnerLanguages.Rust:
        return [
          'sh',
          '-c',
          `${echoCode} > main.rs && ${echoStdin} &&
          rustc main.rs 1> /tmp/stderr 2>> /tmp/stderr && chmod +x main && ./main < stdin 1>> /tmp/stdout 2>> /tmp/stderr && ${returnExecutionResults}`,
        ];
      case RunnerLanguages.Node:
        return [
          'sh',
          '-c',
          `${echoCode} > index.js && ${echoStdin} &&
          node index.js < stdin 1> /tmp/stdout 2> /tmp/stderr && ${returnExecutionResults}`,
        ];
    }
  }
}
