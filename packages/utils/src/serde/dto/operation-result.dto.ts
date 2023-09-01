import { StructV1 } from '@lib/grpc';

export class OperationResultDto implements StructV1.OperationResultDto {
  readonly id: string;
  readonly status: string;

  static create(entity: { id: string; status: string }): OperationResultDto {
    const objectPath: OperationResultDto = {
      id: entity.id,
      status: entity.status,
    };

    return Object.assign(new OperationResultDto(), objectPath);
  }
}
