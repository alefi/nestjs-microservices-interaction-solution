import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { GameServiceClientService, type GameServiceV1 } from '@lib/grpc';
import { GetByIdParamsDto } from '@lib/utils';
import { BeginGameEventParamsDto, EndGameEventParamsDto, ListGameEventsParamsDto, ListGamesParamsDto } from './dto';

@Injectable()
export class GameService {
  private readonly logger = new Logger('GameService', { timestamp: true });

  constructor(private readonly gameServiceClientService: GameServiceClientService) {}

  async beginGameEvent(beginGameEventParams: BeginGameEventParamsDto): Promise<GameServiceV1.GameEventDto> {
    this.logger.debug('Sending request with payload:', JSON.stringify(beginGameEventParams));
    return await firstValueFrom(this.gameServiceClientService.beginGameEvent(beginGameEventParams));
  }

  async endGameEvent(endGameEventParams: EndGameEventParamsDto): Promise<GameServiceV1.GameEventDto> {
    this.logger.debug('Sending request with payload:', JSON.stringify(endGameEventParams));
    return await firstValueFrom(this.gameServiceClientService.endGameEvent(endGameEventParams));
  }

  async getGameEventById(getByIdParams: GetByIdParamsDto): Promise<GameServiceV1.GameEventDto> {
    this.logger.debug('Sending request with payload:', JSON.stringify(getByIdParams));
    return await firstValueFrom(this.gameServiceClientService.getGameEventById(getByIdParams));
  }

  async listGameEvents(listGameEventsParams: ListGameEventsParamsDto): Promise<GameServiceV1.ListGameEventsDto> {
    this.logger.debug('Sending request with payload:', JSON.stringify(listGameEventsParams));
    return await firstValueFrom(this.gameServiceClientService.listGameEvents(listGameEventsParams));
  }

  async listGames(listGamesParams: ListGamesParamsDto): Promise<GameServiceV1.ListGamesDto> {
    this.logger.debug('Sending request with payload:', JSON.stringify(listGamesParams));
    return await firstValueFrom(this.gameServiceClientService.listGames(listGamesParams));
  }
}
