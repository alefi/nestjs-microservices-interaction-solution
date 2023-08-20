import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { GameDto, ListGamesDto, ListGamesParamsDto } from './dto';
import { GameService } from './game.service';

@ApiTags('games')
@Controller('/v1/game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @ApiResponse({ status: HttpStatus.OK, type: ListGamesDto })
  @Get()
  async listGames(@Query() listGamesParams: ListGamesParamsDto): Promise<ListGamesDto> {
    const gameList = await this.gameService.listGames(listGamesParams);
    const items = gameList.items.map(game => GameDto.create(game));
    return ListGamesDto.create(items, gameList.total);
  }
}
