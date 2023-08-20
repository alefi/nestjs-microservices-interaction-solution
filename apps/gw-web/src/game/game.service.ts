import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { GameServiceClientService, type GameServiceV1 } from '@lib/grpc';
import { ListGamesParamsDto } from './dto';

@Injectable()
export class GameService {
  private readonly logger = new Logger('GameService', { timestamp: true });

  constructor(private readonly gameServiceClientService: GameServiceClientService) {}

  async listGames(listGamesParams: ListGamesParamsDto): Promise<GameServiceV1.ListGamesDto> {
    this.logger.debug('Sending request with payload:', JSON.stringify(listGamesParams));
    return await firstValueFrom(this.gameServiceClientService.listGames(listGamesParams));
  }
}
