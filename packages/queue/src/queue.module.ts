import { Module } from '@nestjs/common';
import { QueuePublisherService } from './queue-publisher.service';

@Module({
  providers: [QueuePublisherService],
  exports: [QueuePublisherService],
})
export class QueueModule {}
