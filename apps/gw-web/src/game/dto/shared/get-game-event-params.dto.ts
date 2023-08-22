import { IntersectionType, PickType } from '@nestjs/swagger';

import { type GameServiceV1 } from '@lib/grpc';
import { GetByIdParamsDto } from '@lib/utils';
import { GameEventDto } from '../game-event.dto';

export class GetGameEventParamsDto
  extends IntersectionType(GetByIdParamsDto, PickType(GameEventDto, ['gameId']))
  implements GameServiceV1.GetGameEventParamsDto
{
  declare readonly gameId: string;
  declare readonly id: string;
}
