import { ListResultDto } from '@lib/utils';
import { GameBidDto } from './game-bid.dto';

export class ListGameBidsDto extends ListResultDto<GameBidDto> {
  declare readonly items: GameBidDto[];
  declare readonly total: number;

  static create(items: ReadonlyArray<GameBidDto>, total: number): ListGameBidsDto {
    return Object.assign(new this(), {
      items,
      total,
    });
  }
}
