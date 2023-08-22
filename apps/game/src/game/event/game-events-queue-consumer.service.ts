import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { JobName, QueueName } from '../../queue';

@Processor(QueueName.GameEvents)
export class GameEventsQueueConsumerService {
  private readonly logger = new Logger(GameEventsQueueConsumerService.name, { timestamp: true });

  @Process(JobName.GameEventBeginning)
  gameEventBeginningHandler(job: Job<unknown>) {
    this.logger.log('Received job: ', JSON.stringify(job));
    // TODO Start spawning game sessions (make a repeatable job)
    // TODO Schedule job that finished this event in times
    // TODO Transfer a flow control to sessions queue
  }

  @Process(JobName.GameEventEnding)
  gameEventEndingHandler(job: Job<unknown>) {
    this.logger.log('Received job: ', JSON.stringify(job));
    // TODO Cancel any related scheduled jobs
  }
}
