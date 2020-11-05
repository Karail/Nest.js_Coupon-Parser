import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
//Services
import { DecodeDeepLinkService } from '../services/decode-deep-link.service';
//Interfaces
import { JobResult } from '../../../shared/interfaces';
import { JobDecodeDeepLinkInterface as  JobDecodeDeepLink } from '../interfaces/queue.interface';
//Consumers
import { BaseConsumer } from '../../../shared/consumers/base.consumer';

// Jobs
export const DECODE_DEEPLINK = 'decode-deep-link';

@Processor(`${process.env.REDIS_PREFIX}-decode-deep-link`)
export class DecodeDeepLinkConsumer extends BaseConsumer {
  constructor(
    private readonly decodeDeepLinkService: DecodeDeepLinkService,
  ) {
    super();
  }

  /**
   * Decode dee plink to original url
   * @param job
   */
  @Process({ name: DECODE_DEEPLINK, concurrency: 1 })
  private parse(job: Job<JobDecodeDeepLink>): Promise<JobResult> {
    return this.decodeDeepLinkService.decode(job.data);
  }
}
