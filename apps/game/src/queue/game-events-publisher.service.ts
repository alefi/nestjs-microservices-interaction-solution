import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';

import { QueueName } from './config';
import { QueuePublisher } from './core';

@Injectable()
export class GameEventsPublisherService extends QueuePublisher {
  constructor(@InjectQueue(QueueName.GameEvents) protected queue: Queue) {
    super();
  }
}
