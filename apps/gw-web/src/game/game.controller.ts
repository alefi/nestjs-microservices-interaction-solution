import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetByIdParamsDto } from '@lib/utils';
import {
  BeginGameEventParamsDto,
  EndGameEventParamsDto,
  GameDto,
  GameEventDto,
  GetGameEventParamsDto,
  ListGameEventsDto,
  ListGameEventsParamsDto,
  ListGamesDto,
  ListGamesParamsDto,
} from './dto';
import { GameService } from './game.service';

@ApiTags('games')
@Controller('/v1/game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @ApiOperation({
    description: 'In turn it will spawn sessions according to the settings.',
    summary: 'Trigger a game event',
  })
  @Post(':gameId/event')
  async beginGameEvent(
    @Param('gameId') gameId: GetByIdParamsDto['id'],
    @Body() beginGameEventParams: BeginGameEventParamsDto,
  ): Promise<GameEventDto> {
    const gameEvent = await this.gameService.beginGameEvent({
      ...beginGameEventParams,
      gameId,
    });
    return GameEventDto.create(gameEvent);
  }

  @ApiOperation({
    description: "It cancels a game event and informs it mustn't generate new game sessions.",
    summary: 'Cancel a game event',
  })
  @Delete(':gameId/event/:id')
  async endGameEvent(
    @Param() getGameEventParams: GetGameEventParamsDto,
    @Body() endGameEventParams: EndGameEventParamsDto,
  ): Promise<GameEventDto> {
    const gameEvent = await this.gameService.endGameEvent({
      ...getGameEventParams,
      ...endGameEventParams,
    });
    return GameEventDto.create(gameEvent);
  }

  @ApiOperation({ summary: 'Retrieve the game event by id' })
  @Get(':gameId/event/:id')
  async getGameEventById(@Param() getGameEventParams: GetGameEventParamsDto): Promise<GameEventDto> {
    const gameEvent = await this.gameService.getGameEventById(getGameEventParams);
    return GameEventDto.create(gameEvent);
  }

  @ApiOperation({ summary: 'Retrieve a game event list' })
  @Get(':gameId/event')
  async listGameEvents(
    @Param('gameId') gameId: GetByIdParamsDto['id'],
    @Query() listGameEventsParams: ListGameEventsParamsDto,
  ): Promise<ListGameEventsDto> {
    const gameEventList = await this.gameService.listGameEvents({
      ...listGameEventsParams,
      gameId,
    });
    const items = gameEventList.items.map(game => GameEventDto.create(game));
    return ListGameEventsDto.create(items, gameEventList.total);
  }

  @ApiOperation({ summary: 'Retrieve a game list' })
  @Get()
  async listGames(@Query() listGamesParams: ListGamesParamsDto): Promise<ListGamesDto> {
    const gameList = await this.gameService.listGames(listGamesParams);
    const items = gameList.items.map(game => GameDto.create(game));
    return ListGamesDto.create(items, gameList.total);
  }
}
