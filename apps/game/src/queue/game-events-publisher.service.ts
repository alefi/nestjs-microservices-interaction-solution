import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import { QueueName, QueuePublisherService } from '@lib/queue';

@Injectable()
export class GameEventsPublisherService extends QueuePublisherService {
  constructor(@InjectQueue(QueueName.GameEvents) protected queue: Queue) {
    super();
  }
}
