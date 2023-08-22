import { ListResultDto } from '@lib/utils';
import { GameSessionDto } from './game-session.dto';

export class ListGameSessionsDto extends ListResultDto<GameSessionDto> {
  declare readonly items: GameSessionDto[];
  declare readonly total: number;

  static create(items: ReadonlyArray<GameSessionDto>, total: number): ListGameSessionsDto {
    return Object.assign(new this(), {
      items,
      total,
    });
  }
}
