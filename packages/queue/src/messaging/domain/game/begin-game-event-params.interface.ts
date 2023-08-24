export interface IBeginGameEventParams {
  readonly id: string;
  readonly gameId: string;
  readonly finishAt: Date;
  readonly sessionsCountLimit: number;
  readonly sessionDurationSeconds: number;
  readonly simultaneousSessionsCount: number;
}
