import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { tempAuthHeader } from '@lib/utils';
import { ApplyBidParamsDto, GameBidDto } from './dto';
import { GameBidService } from './game-bid.service';

@ApiTags('games')
@Controller('/v1/game/:gameId/session/:sessionId/bid')
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
    @Body() applyBidParams: ApplyBidParamsDto,
  ): Promise<GameBidDto> {
    const gameBid = await this.gameBidService.applyBid({
      ...applyBidParams,
      userId,
    });
    return GameBidDto.create(gameBid);
  }
}
