import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class GetByIdParamsDto {
  @ApiProperty({
    description: 'An entity unique identifier',
    format: 'uuid',
  })
  @Transform(({ value }) => String(value).toLowerCase())
  @IsUUID()
  readonly id: string;
}
