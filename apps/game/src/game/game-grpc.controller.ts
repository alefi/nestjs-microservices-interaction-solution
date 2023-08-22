import { GrpcMethod, GrpcService } from '@nestjs/microservices';

import { GameServiceV1 } from '@lib/grpc';
import { GameDto, ListGamesDto } from './dto';
import { GameService } from './game.service';

@GrpcService()
export class GameGrpcController {
  constructor(private readonly gameService: GameService) {}

  @GrpcMethod('GameService')
  async listGames(listGamesParams: GameServiceV1.ListGamesParamsDto): Promise<ListGamesDto> {
    const [games, total] = await this.gameService.listGames(listGamesParams);
    const items = games.map(item => GameDto.fromModel(item));
    return ListGamesDto.create(items, total);
  }
}
