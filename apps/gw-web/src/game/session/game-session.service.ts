import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { GameServiceClientService, type GameServiceV1 } from '@lib/grpc';

@Injectable()
export class GameSessionService {
  private readonly logger = new Logger(GameSessionService.name, { timestamp: true });

  constructor(private readonly gameServiceClientService: GameServiceClientService) {}

  async getGameSessionById(
    getGameSessionParams: GameServiceV1.GetGameSessionParamsDto,
  ): Promise<GameServiceV1.GameSessionDto> {
    this.logger.debug('Sending request with payload:', JSON.stringify(getGameSessionParams));
    return await firstValueFrom(this.gameServiceClientService.getGameSessionById(getGameSessionParams));
  }

  async listGameSessions(
    listGameSessionsParams: GameServiceV1.ListGameSessionsParamsDto,
  ): Promise<GameServiceV1.ListGameSessionsDto> {
    this.logger.debug('Sending request with payload:', JSON.stringify(listGameSessionsParams));
    return await firstValueFrom(this.gameServiceClientService.listGameSessions(listGameSessionsParams));
  }
}
