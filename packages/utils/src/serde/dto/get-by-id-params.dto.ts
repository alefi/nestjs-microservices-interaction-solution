import { Transform } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class GetByIdParamsDto {
  @Transform(({ value }) => String(value).toLowerCase())
  @IsUUID()
  id: string;
}
