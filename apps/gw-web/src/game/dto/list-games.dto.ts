import { ApiExtraModels } from '@nestjs/swagger';

import { ListResultDto } from '@lib/utils';
import { GameDto } from './game.dto';

@ApiExtraModels(GameDto)
export class ListGamesDto extends ListResultDto<GameDto> {
  declare readonly items: GameDto[];

  /**
   * Total count of items
   * @example 1
   */
  declare readonly total: number;

  static create(items: ReadonlyArray<GameDto>, total: number): ListGamesDto {
    return Object.assign(new this(), {
      items,
      total,
    });
  }
}
