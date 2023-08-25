import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { tempAuthHeader } from '@lib/utils';
import { ApplyBidParamsDto, GameBidDto, GetGameBidParamsDto } from './dto';
import { GameBidService } from './game-bid.service';

@ApiTags('games')
@Controller('/v1/game/:gameId/event/:gameEventId/session/:gameSessionId/bid')
export class GameBidController {
  constructor(private readonly gameBidService: GameBidService) {}

  /**
   * @description Since this project doesn't have an authorisation at all, x-user-id header should be provided by a client (of course, this approach is not ready for production).
   * TODO Make a JWT authorisation based auth service, and get rid of this approach.
   */
  @ApiOperation({
    description:
      "Since this project doesn't have an authorisation at all, x-user-id header should be provided by a client (of course, this approach is not ready for production).",
    summary: 'Place a bid on active game session',
  })
  @Post()
  async applyBid(
    @Headers(tempAuthHeader) userId: string,
    @Param() getGameBidParams: Omit<GetGameBidParamsDto, 'id'>,
    @Body() applyBidParams: ApplyBidParamsDto,
  ): Promise<GameBidDto> {
    const gameBid = await this.gameBidService.applyBid({
      userId,
      gameSessionId: getGameBidParams.gameSessionId,
      currencyAmount: applyBidParams.currencyAmount,
      value: applyBidParams.value,
    });
    return GameBidDto.create(gameBid);
  }

  @ApiOperation({
    description:
      "Since this project doesn't have an authorisation at all, x-user-id header should be provided by a client (of course, this approach is not ready for production).",
    summary: 'Place a bid on active game session',
  })
  @Get(':id')
  async getGameBidById(
    @Headers(tempAuthHeader) userId: string,
    @Param() getGameBidParams: GetGameBidParamsDto,
  ): Promise<GameBidDto> {
    const gameBid = await this.gameBidService.getGameBidById({
      userId,
      id: getGameBidParams.id,
      gameSessionId: getGameBidParams.gameSessionId,
    });
    return GameBidDto.create(gameBid);
  }
}
