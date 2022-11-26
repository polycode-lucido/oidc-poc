import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { to500 } from '@polycode/to';
import { firstValueFrom } from 'rxjs';
import { RunnerExecutionResults, RunnerWorkload } from './types';
import { AxiosResponse as _AxiosResponse } from '@nestjs/axios/node_modules/axios';

export type AxiosResponse = _AxiosResponse;
@Injectable()
export class RunnerConsumerService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * It takes a RunnerWorkload object, sends it to the Runner API, and returns the RunnerExecutionResults
   * object
   * @param {RunnerWorkload} runnerWorkload - RunnerWorkload
   * @returns AxiosResponse<RunnerExecutionResults>
   */
  run(runnerWorkload: RunnerWorkload) {
    return to500(
      firstValueFrom(
        this.httpService.post<RunnerExecutionResults>(
          `${process.env.RUNNER_API_URL}/run`,
          runnerWorkload
        )
      )
    );
  }
}
