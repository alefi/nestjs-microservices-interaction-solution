import { GrpcMethod, GrpcService } from '@nestjs/microservices';

import { GameServiceV1 } from '@lib/grpc';
import { GameBidDto } from './dto';
import { GameBidService } from './game-bid.service';

@GrpcService()
export class GameBidGrpcController {
  constructor(private readonly gameBidService: GameBidService) {}

  @GrpcMethod('GameService')
  async applyBid(applyBidParams: GameServiceV1.ApplyBidParamsDto): Promise<GameServiceV1.GameBidDto> {
    const bid = await this.gameBidService.applyBid(applyBidParams);
    return GameBidDto.fromModel(bid);
  }
}
