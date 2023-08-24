import { Logger, OnModuleDestroy } from '@nestjs/common';
import { JobsOptions, Queue } from 'bullmq';

import { JobName } from '@lib/queue';

export class QueuePublisherService implements OnModuleDestroy {
  protected queue: Queue;
  private readonly logger = new Logger(QueuePublisherService.name, { timestamp: true });

  async publish(name: JobName, data: unknown, options?: JobsOptions) {
    const job = await this.queue.add(name, data, (options = {}));
    this.logger.debug(
      `Published ${name}:${job.id} along both with data ${JSON.stringify(data)} and options ${JSON.stringify(options)}`,
    );
    return job;
  }

  async onModuleDestroy() {
    await this.queue.close();
  }
}
