import { GrpcMethod, GrpcService } from '@nestjs/microservices';

import { GameServiceV1 } from '@lib/grpc';
import { GameSessionDto, ListGameSessionsDto } from './dto';
import { GameSessionService } from './game-session.service';

@GrpcService()
export class GameSessionGrpcController {
  constructor(private readonly gameSessionService: GameSessionService) {}

  @GrpcMethod('GameService')
  async getGameSessionById(getGameSessionParams: GameServiceV1.GetGameSessionParamsDto): Promise<GameSessionDto> {
    const gameSession = await this.gameSessionService.getGameSessionById(getGameSessionParams);
    return GameSessionDto.fromModel(gameSession);
  }

  @GrpcMethod('GameService')
  async listGameSessions(
    listGameSessionsParams: GameServiceV1.ListGameSessionsParamsDto,
  ): Promise<ListGameSessionsDto> {
    const [gameSessions, total] = await this.gameSessionService.listGameSessions(listGameSessionsParams);
    const items = gameSessions.map(item => GameSessionDto.fromModel(item));
    return ListGameSessionsDto.create(items, total);
  }
}
