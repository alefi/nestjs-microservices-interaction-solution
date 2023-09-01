import { GrpcMethod, GrpcService } from '@nestjs/microservices';

import { GameServiceV1 } from '@lib/grpc';
import { GameBidDto, ListGameBidsDto } from './dto';
import { GameBidService } from './game-bid.service';

@GrpcService()
export class GameBidGrpcController {
  constructor(private readonly gameBidService: GameBidService) {}

  @GrpcMethod('GameService')
  async applyBid(applyBidParams: GameServiceV1.ApplyBidParamsDto): Promise<GameServiceV1.GameBidDto> {
    const bid = await this.gameBidService.applyBid(applyBidParams);
    return GameBidDto.fromModel(bid);
  }

  @GrpcMethod('GameService')
  async getGameBidById(getGameBidParams: GameServiceV1.GetGameBidParamsDto): Promise<GameServiceV1.GameBidDto> {
    const bid = await this.gameBidService.get(getGameBidParams);
    return GameBidDto.fromModel(bid);
  }

  @GrpcMethod('GameService')
  async listGameBids(listGameBidsParams: GameServiceV1.ListGameBidsParamsDto): Promise<GameServiceV1.ListGameBidsDto> {
    const [gameBids, total] = await this.gameBidService.listGameBids(listGameBidsParams);
    const items = gameBids.map(item => GameBidDto.fromModel(item));
    return ListGameBidsDto.create(items, total);
  }
}
