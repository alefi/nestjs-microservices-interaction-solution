import { ListResultDto } from '@lib/utils';
import { GameDto } from './game.dto';

export class ListGamesDto extends ListResultDto<GameDto> {
  declare items: GameDto[];
  declare total: number;

  static create(items: ReadonlyArray<GameDto>, total: number): ListGamesDto {
    return Object.assign(new this(), {
      items,
      total,
    });
  }
}
