import { ListResultDto } from '@lib/utils';
import { GameDto } from './game.dto';

export class ListGamesDto extends ListResultDto<GameDto> {
  declare readonly items: GameDto[];
  declare readonly total: number;

  static create(items: ReadonlyArray<GameDto>, total: number): ListGamesDto {
    return Object.assign(new this(), {
      items,
      total,
    });
  }
}
