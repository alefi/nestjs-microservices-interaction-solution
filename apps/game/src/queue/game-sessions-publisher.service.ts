import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import { QueueName, QueuePublisherService } from '@lib/queue';

@Injectable()
export class GameSessionsPublisherService extends QueuePublisherService {
  constructor(@InjectQueue(QueueName.GameSessions) protected queue: Queue) {
    super();
  }
}
