import { ApiExtraModels } from '@nestjs/swagger';

import { ListResultDto } from '@lib/utils';
import { GameEventDto } from './game-event.dto';

@ApiExtraModels(GameEventDto)
export class ListGameEventsDto extends ListResultDto<GameEventDto> {
  declare items: GameEventDto[];

  /**
   * Total count of items
   * @example 1
   */
  declare total: number;

  static create(items: ReadonlyArray<GameEventDto>, total: number): ListGameEventsDto {
    return Object.assign(new this(), {
      items,
      total,
    });
  }
}
