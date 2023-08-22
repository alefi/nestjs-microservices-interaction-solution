import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApplyBidParamsDto, GameBidDto } from './dto';
import { GameBidService } from './game-bid.service';

@ApiTags('games')
@Controller('/v1/game/:gameId/bid')
export class GameBidController {
  constructor(private readonly gameBidService: GameBidService) {}

  @ApiOperation({
    description: 'Place a bid on active game session.',
    summary: 'Place a bid',
  })
  @Post()
  async applyBid(@Body() applyBidParams: ApplyBidParamsDto): Promise<GameBidDto> {
    const gameBid = await this.gameBidService.applyBid(applyBidParams);
    return GameBidDto.create(gameBid);
  }
}
