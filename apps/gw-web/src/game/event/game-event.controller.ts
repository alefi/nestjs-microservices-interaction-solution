import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetByIdParamsDto } from '@lib/utils';
import {
  BeginGameEventParamsDto,
  EndGameEventParamsDto,
  GameEventDto,
  GetGameEventParamsDto,
  ListGameEventsDto,
  ListGameEventsParamsDto,
} from './dto';
import { GameEventService } from './game-event.service';

@ApiTags('games')
@Controller('/v1/game/:gameId/event')
export class GameEventController {
  constructor(private readonly gameEventService: GameEventService) {}

  @ApiOperation({
    description: 'In turn it will spawn sessions according to the settings.',
    summary: 'Trigger a game event',
  })
  @Post()
  async beginGameEvent(
    @Param('gameId') gameId: GetByIdParamsDto['id'],
    @Body() beginGameEventParams: BeginGameEventParamsDto,
  ): Promise<GameEventDto> {
    const gameEvent = await this.gameEventService.beginGameEvent({
      ...beginGameEventParams,
      gameId,
    });
    return GameEventDto.create(gameEvent);
  }

  @ApiOperation({
    description: "It cancels a game event and informs it mustn't generate new game sessions.",
    summary: 'Cancel a game event',
  })
  @Delete(':id')
  async endGameEvent(
    @Param() getGameEventParams: GetGameEventParamsDto,
    @Body() endGameEventParams: EndGameEventParamsDto,
  ): Promise<GameEventDto> {
    const gameEvent = await this.gameEventService.endGameEvent({
      ...getGameEventParams,
      ...endGameEventParams,
      isCancelled: true,
    });
    return GameEventDto.create(gameEvent);
  }

  @ApiOperation({ summary: 'Retrieve the game event by id' })
  @Get(':id')
  async getGameEventById(@Param() getGameEventParams: GetGameEventParamsDto): Promise<GameEventDto> {
    const gameEvent = await this.gameEventService.getGameEventById(getGameEventParams);
    return GameEventDto.create(gameEvent);
  }

  @ApiOperation({ summary: 'Retrieve a game event list' })
  @Get()
  async listGameEvents(
    @Param('gameId') gameId: GetByIdParamsDto['id'],
    @Query() listGameEventsParams: ListGameEventsParamsDto,
  ): Promise<ListGameEventsDto> {
    const gameEventList = await this.gameEventService.listGameEvents({
      ...listGameEventsParams,
      gameId,
    });
    const items = gameEventList.items.map(game => GameEventDto.create(game));
    return ListGameEventsDto.create(items, gameEventList.total);
  }
}
