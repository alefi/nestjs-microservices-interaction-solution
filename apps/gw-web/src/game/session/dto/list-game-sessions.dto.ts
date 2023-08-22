import { ApiExtraModels } from '@nestjs/swagger';

import { ListResultDto } from '@lib/utils';
import { GameSessionDto } from './game-session.dto';

@ApiExtraModels(GameSessionDto)
export class ListGameSessionsDto extends ListResultDto<GameSessionDto> {
  declare readonly items: GameSessionDto[];

  /**
   * Total count of items
   * @example 1
   */
  declare readonly total: number;

  static create(items: ReadonlyArray<GameSessionDto>, total: number): ListGameSessionsDto {
    return Object.assign(new this(), {
      items,
      total,
    });
  }
}
