export interface IBeginGameSessionParams {
  readonly gameEventId: string;
  readonly sessionDurationSeconds: number;
  readonly sessionsCountLimit: number;
}
