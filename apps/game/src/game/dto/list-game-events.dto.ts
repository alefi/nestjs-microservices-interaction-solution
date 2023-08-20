import { ListResultDto } from '@lib/utils';
import { GameEventDto } from './game-event.dto';

export class ListGameEventsDto extends ListResultDto<GameEventDto> {
  declare items: GameEventDto[];
  declare total: number;

  static create(items: ReadonlyArray<GameEventDto>, total: number): ListGameEventsDto {
    return Object.assign(new this(), {
      items,
      total,
    });
  }
}
