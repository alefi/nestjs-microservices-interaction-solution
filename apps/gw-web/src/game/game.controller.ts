import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  BeginGameEventParamsDto,
  GameDto,
  GameEventDto,
  ListGameEventsDto,
  ListGameEventsParamsDto,
  ListGamesDto,
  ListGamesParamsDto,
} from './dto';
import { GameService } from './game.service';
import { GetByIdParamsDto } from '@lib/utils';

@ApiTags('games')
@Controller('/v1/game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @ApiOperation({
    description: 'In turn it will spawn sessions according to the settings.',
    summary: 'Trigger a game event',
  })
  @Post('event')
  async beginGameEvent(@Body() beginGameEventParams: BeginGameEventParamsDto): Promise<GameEventDto> {
    const gameEvent = await this.gameService.beginGameEvent(beginGameEventParams);
    return GameEventDto.create(gameEvent);
  }

  @ApiOperation({ summary: 'Retrieve the game event by id' })
  @Get('event/:id')
  async getGameEventById(@Param() getByIdParams: GetByIdParamsDto): Promise<GameEventDto> {
    const gameEvent = await this.gameService.getGameEventById(getByIdParams);
    return GameEventDto.create(gameEvent);
  }

  @ApiOperation({ summary: 'Retrieve a game event list' })
  @Get('event')
  async listGameEvents(@Query() listGameEventsParams: ListGameEventsParamsDto): Promise<ListGameEventsDto> {
    const gameEventList = await this.gameService.listGameEvents(listGameEventsParams);
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
