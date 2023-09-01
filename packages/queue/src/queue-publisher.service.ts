import { Logger, OnModuleDestroy } from '@nestjs/common';
import { type BulkJobOptions, type FlowChildJob, FlowProducer, type JobsOptions, Queue } from 'bullmq';

import { JobName } from '@lib/queue';

export class QueuePublisherService implements OnModuleDestroy {
  protected queue: Queue;
  private readonly logger = new Logger(QueuePublisherService.name, { timestamp: true });

  // A FlowProducer constructor takes an optional "connection"
  // object otherwise it connects to a local redis instance.
  private readonly flowProducer = new FlowProducer();

  async bulk(bulkArgs: { name: JobName; data: unknown; opts?: BulkJobOptions }[]) {
    const jobs = await this.queue.addBulk(bulkArgs);
    return jobs;
  }

  async publish(name: JobName, data: unknown, opts: JobsOptions = {}) {
    const job = await this.queue.add(name, data, opts);
    this.logger.debug(
      `Published ${name}:${job.id} along both with data ${JSON.stringify(data)} and options ${JSON.stringify(opts)}`,
    );
    return job;
  }

  async publishFlow(name: JobName, data: unknown, children: FlowChildJob[], opts: JobsOptions = {}) {
    const flow = await this.flowProducer.add({
      name,
      queueName: this.queue.name,
      data,
      opts,
      children,
    });
    this.logger.debug(
      `Published ${name}:${flow.job.id} along with data ${JSON.stringify(data)}, options ${JSON.stringify(
        opts,
      )}, and children jobs ${JSON.stringify(children)}`,
    );
    return flow;
  }

  async onModuleDestroy() {
    await this.queue.close();
  }
}
