import { IsBoolean, IsOptional } from 'class-validator';

import { GameServiceV1 } from '@lib/grpc';
import { Transform } from 'class-transformer';

export class ListGamesParamsDto implements GameServiceV1.ListGamesParamsDto {
  /**
   * Filter only available games
   */
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  @IsBoolean()
  readonly isAvailable?: boolean;
}
