import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { JobsOptions, Queue } from 'bullmq';
import { JobName, QueueName } from './config';

@Injectable()
export class QueueService {
  private readonly logger = new Logger('GameQueueService', { timestamp: true });

  constructor(@InjectQueue(QueueName.GameSessions) private gameSessionsQueue: Queue) {}

  async publish(name: JobName, data: unknown, options: JobsOptions) {
    this.logger.debug(
      `Received data ${JSON.stringify(data)} along with options ${JSON.stringify(options)} to publish into ${
        QueueName.GameSessions
      }`,
    );

    return await this.gameSessionsQueue.add(name, data, options);
  }
}
