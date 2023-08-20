import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';

import { JobName, QueueName } from './config';

@Processor(QueueName.GameSessions)
export class GameSessionsQueueConsumerService {
  @Process(JobName.GameSessionBeginning)
  sessionBeginningHandler(job: Job<unknown>) {
    console.log('Received job: ', JSON.stringify(job));
  }

  @Process(JobName.GameSessionEnding)
  sessionEndingHandler(job: Job<unknown>) {
    console.log('Received job: ', JSON.stringify(job));
  }
}
