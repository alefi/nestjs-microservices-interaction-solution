import { ApiProperty } from '@nestjs/swagger';

import { GameServiceV1 } from '@lib/grpc';
import { GetByIdParamsDto } from '@lib/utils';

export class EndGameEventParamsDto extends GetByIdParamsDto implements GameServiceV1.EndGameEventParamsDto {
  declare readonly id: string;

  @ApiProperty({
    description: 'The cancellation reason if applied',
    example: 'Cancelled due to abuse detected',
  })
  readonly cancellationReason?: string;
}
