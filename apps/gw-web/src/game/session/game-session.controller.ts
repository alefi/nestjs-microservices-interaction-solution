import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { GameSessionDto, GetGameSessionParamsDto, ListGameSessionsDto, ListGameSessionsParamsDto } from './dto';
import { GameSessionService } from './game-session.service';

@ApiTags('games')
@Controller('/v1/game/:gameId/event/:gameEventId/session')
export class GameSessionController {
  constructor(private readonly gameSessionService: GameSessionService) {}

  @ApiOperation({ summary: 'Retrieve the game session by id' })
  @Get(':id')
  async getGameSessionById(@Param() getGameSessionParams: GetGameSessionParamsDto): Promise<GameSessionDto> {
    const gameSession = await this.gameSessionService.getGameSessionById({
      gameEventId: getGameSessionParams.gameEventId,
      id: getGameSessionParams.id,
    });
    return GameSessionDto.create(gameSession);
  }

  @ApiOperation({ summary: 'Retrieve a game session list' })
  @Get()
  async listGameSessions(@Query() listGameSessionsParams: ListGameSessionsParamsDto): Promise<ListGameSessionsDto> {
    const gameSessionList = await this.gameSessionService.listGameSessions(listGameSessionsParams);
    const items = gameSessionList.items.map(item => GameSessionDto.create(item));
    return ListGameSessionsDto.create(items, gameSessionList.total);
  }
}
