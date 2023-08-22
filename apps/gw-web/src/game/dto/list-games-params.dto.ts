import { PartialType, PickType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

import { type GameServiceV1 } from '@lib/grpc';
import { GameDto } from './game.dto';

export class ListGamesParamsDto
  extends PartialType(PickType(GameDto, ['isAvailable']))
  implements GameServiceV1.ListGamesParamsDto
{
  /**
   * Filter only available games
   */
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  @IsBoolean()
  declare readonly isAvailable?: boolean;
}
