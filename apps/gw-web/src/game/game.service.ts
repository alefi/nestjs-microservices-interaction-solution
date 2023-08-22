import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { GameServiceClientService, type GameServiceV1 } from '@lib/grpc';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name, { timestamp: true });

  constructor(private readonly gameServiceClientService: GameServiceClientService) {}

  async beginGameEvent(
    beginGameEventParams: GameServiceV1.BeginGameEventParamsDto,
  ): Promise<GameServiceV1.GameEventDto> {
    this.logger.debug('Sending request with payload:', JSON.stringify(beginGameEventParams));
    return await firstValueFrom(this.gameServiceClientService.beginGameEvent(beginGameEventParams));
  }

  async endGameEvent(endGameEventParams: GameServiceV1.EndGameEventParamsDto): Promise<GameServiceV1.GameEventDto> {
    this.logger.debug('Sending request with payload:', JSON.stringify(endGameEventParams));
    return await firstValueFrom(this.gameServiceClientService.endGameEvent(endGameEventParams));
  }

  async getGameEventById(getGameEventParams: GameServiceV1.GetGameEventParamsDto): Promise<GameServiceV1.GameEventDto> {
    this.logger.debug('Sending request with payload:', JSON.stringify(getGameEventParams));
    return await firstValueFrom(this.gameServiceClientService.getGameEventById(getGameEventParams));
  }

  async listGameEvents(
    listGameEventsParams: GameServiceV1.ListGameEventsParamsDto,
  ): Promise<GameServiceV1.ListGameEventsDto> {
    this.logger.debug('Sending request with payload:', JSON.stringify(listGameEventsParams));
    return await firstValueFrom(this.gameServiceClientService.listGameEvents(listGameEventsParams));
  }

  async listGames(listGamesParams: GameServiceV1.ListGamesParamsDto): Promise<GameServiceV1.ListGamesDto> {
    this.logger.debug('Sending request with payload:', JSON.stringify(listGamesParams));
    return await firstValueFrom(this.gameServiceClientService.listGames(listGamesParams));
  }
}
