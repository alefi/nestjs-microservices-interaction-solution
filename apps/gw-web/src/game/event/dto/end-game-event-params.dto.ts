import { PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { GameEventDto } from './game-event.dto';

export class EndGameEventParamsDto extends PickType(GameEventDto, ['cancellationReason']) {
  @IsOptional()
  declare readonly cancellationReason?: string;
}
