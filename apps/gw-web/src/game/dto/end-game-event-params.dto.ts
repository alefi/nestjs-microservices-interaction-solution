import { PickType } from '@nestjs/swagger';

import { GameServiceV1 } from '@lib/grpc';
import { GameEventDto } from './game-event.dto';

export class EndGameEventParamsDto
  extends PickType(GameEventDto, ['id', 'cancellationReason'])
  implements GameServiceV1.EndGameEventParamsDto
{
  declare readonly id: string;
  declare readonly cancellationReason?: string;
}
