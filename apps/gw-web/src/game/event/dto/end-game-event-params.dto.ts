import { PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { GameEventDto } from './game-event.dto';

export class EndGameEventParamsDto extends PickType(GameEventDto, ['cancellationReason']) {
  @IsString()
  declare readonly cancellationReason: string;
}
