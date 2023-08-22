import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { GameServiceClientService, type GameServiceV1 } from '@lib/grpc';

@Injectable()
export class GameBidService {
  private readonly logger = new Logger('GameBidService', { timestamp: true });

  constructor(private readonly gameServiceClientService: GameServiceClientService) {}

  async applyBid(applyBidParams: GameServiceV1.ApplyBidParamsDto): Promise<GameServiceV1.GameBidDto> {
    this.logger.debug('Sending request with payload:', JSON.stringify(applyBidParams));
    return await firstValueFrom(this.gameServiceClientService.applyBid(applyBidParams));
  }
}
