import { Logger, OnModuleDestroy } from '@nestjs/common';
import { JobsOptions, Queue } from 'bullmq';

import { JobName } from '../config';

export abstract class QueuePublisher implements OnModuleDestroy {
  protected queue: Queue;
  private readonly logger = new Logger(QueuePublisher.name, { timestamp: true });

  async publish(name: JobName, data: unknown, options?: JobsOptions) {
    this.logger.debug(
      `Publishing job ${name} along both with data ${JSON.stringify(data)} and options ${JSON.stringify(options)}`,
    );
    return await this.queue.add(name, data, options);
  }

  async onModuleDestroy() {
    await this.queue.close();
  }
}
