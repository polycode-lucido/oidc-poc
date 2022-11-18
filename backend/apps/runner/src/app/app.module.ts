import { Module } from '@nestjs/common';
import { RunnerProviderModule } from '@polycode/runner-provider';
import { AppController } from './app.controller';
import { PrometheusModule } from '@polycode/prometheus';

@Module({
  imports: [RunnerProviderModule.forRoot(), PrometheusModule],
  controllers: [AppController],
})
export class AppModule {}
