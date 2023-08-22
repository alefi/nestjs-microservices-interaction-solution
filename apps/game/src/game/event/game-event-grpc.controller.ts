import { GrpcMethod, GrpcService } from '@nestjs/microservices';

import { GameServiceV1 } from '@lib/grpc';
import { GameEventDto, ListGameEventsDto } from './dto';
import { GameEventService } from './game-event.service';

@GrpcService()
export class GameEventGrpcController {
  constructor(private readonly gameEventService: GameEventService) {}

  @GrpcMethod('GameService')
  async beginGameEvent(beginGameEventParams: GameServiceV1.BeginGameEventParamsDto): Promise<GameEventDto> {
    const gameEvent = await this.gameEventService.beginGameEvent(beginGameEventParams);
    return GameEventDto.fromModel(gameEvent);
  }

  @GrpcMethod('GameService')
  async endGameEvent(endGameEventParams: GameServiceV1.EndGameEventParamsDto): Promise<GameEventDto> {
    const gameEvent = await this.gameEventService.endGameEvent(endGameEventParams);
    return GameEventDto.fromModel(gameEvent);
  }

  @GrpcMethod('GameService')
  async getGameEventById(getGameEventParams: GameServiceV1.GetGameEventParamsDto): Promise<GameEventDto> {
    const gameEvent = await this.gameEventService.getGameEventById(getGameEventParams);
    return GameEventDto.fromModel(gameEvent);
  }

  @GrpcMethod('GameService')
  async listGameEvents(listGameEventsParams: GameServiceV1.ListGameEventsParamsDto): Promise<ListGameEventsDto> {
    const [gameEvents, total] = await this.gameEventService.listGameEvents(listGameEventsParams);
    const items = gameEvents.map(item => GameEventDto.fromModel(item));
    return ListGameEventsDto.create(items, total);
  }
}
