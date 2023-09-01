import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import { QueueName, QueuePublisherService } from '@lib/queue';

@Injectable()
export class GameBidsPublisherService extends QueuePublisherService {
  constructor(@InjectQueue(QueueName.GameBids) protected queue: Queue) {
    super();
  }
}
