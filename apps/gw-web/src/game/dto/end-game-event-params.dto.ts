import { PickType } from '@nestjs/swagger';

import { GameEventDto } from './game-event.dto';
import { IsOptional } from 'class-validator';

export class EndGameEventParamsDto extends PickType(GameEventDto, ['cancellationReason']) {
  @IsOptional()
  declare readonly cancellationReason?: string;
}
