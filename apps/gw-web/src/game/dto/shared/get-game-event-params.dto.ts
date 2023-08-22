import { IntersectionType, PickType } from '@nestjs/swagger';

import { GameEventDto } from '../game-event.dto';
import { GetByIdParamsDto } from '@lib/utils';
import { GameServiceV1 } from '@lib/grpc';

export class GetGameEventParamsDto
  extends IntersectionType(GetByIdParamsDto, PickType(GameEventDto, ['gameId']))
  implements GameServiceV1.GetGameEventParamsDto
{
  declare readonly gameId: string;
  declare readonly id: string;
}
