import { GrpcMethod, GrpcService } from '@nestjs/microservices';

import { GameServiceV1, StructV1 } from '@lib/grpc';
import { GameDto, GameEventDto, ListGameEventsDto, ListGamesDto } from './dto';
import { GameService } from './game.service';

@GrpcService()
export class GameGrpcController {
  constructor(private readonly gameService: GameService) {}

  @GrpcMethod('GameService')
  async beginGameEvent(beginGameEventParams: GameServiceV1.BeginGameEventParamsDto): Promise<GameEventDto> {
    const gameEvent = await this.gameService.beginGameEvent(beginGameEventParams);
    return GameEventDto.fromModel(gameEvent);
  }

  @GrpcMethod('GameService')
  async endGameEvent(endGameEventParams: GameServiceV1.EndGameEventParamsDto): Promise<GameEventDto> {
    const gameEvent = await this.gameService.endGameEvent(endGameEventParams);
    return GameEventDto.fromModel(gameEvent);
  }

  @GrpcMethod('GameService')
  async getGameEventById(getEntityByIdParams: StructV1.GetEntityByIdParamsDto): Promise<GameEventDto> {
    const gameEvent = await this.gameService.getGameEventById(getEntityByIdParams);
    return GameEventDto.fromModel(gameEvent);
  }

  @GrpcMethod('GameService')
  async listGameEvents(listGameEventsParams: GameServiceV1.ListGameEventsParamsDto): Promise<ListGameEventsDto> {
    const [gameEvents, total] = await this.gameService.listGameEvents(listGameEventsParams);
    const items = gameEvents.map(item => GameEventDto.fromModel(item));
    return ListGameEventsDto.create(items, total);
  }

  @GrpcMethod('GameService')
  async listGames(listGamesParams: GameServiceV1.ListGamesParamsDto): Promise<ListGamesDto> {
    const [games, total] = await this.gameService.listGames(listGamesParams);
    const items = games.map(item => GameDto.fromModel(item));
    return ListGamesDto.create(items, total);
  }
}
