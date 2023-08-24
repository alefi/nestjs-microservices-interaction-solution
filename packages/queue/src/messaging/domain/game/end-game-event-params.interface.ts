export class IEndGameEventParams {
  readonly id: string;
  readonly isCancelled: boolean;
  readonly cancellationReason?: string;
}
