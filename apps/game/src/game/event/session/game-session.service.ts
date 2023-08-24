import { Injectable } from '@nestjs/common';
import { JobsOptions } from 'bullmq';

import { type GameSession, Prisma } from '@prisma/client';
import { PrismaService } from '@lib/db';
import { type GameServiceV1 } from '@lib/grpc';
import { IBeginGameSessionParams, IEndGameSessionParams, JobName } from '@lib/queue';
import { GameSessionsPublisherService } from '../../../queue';
import { calculateDelayByFutureTimestamp } from '../helpers';
import { dateTime } from '@lib/utils';

@Injectable()
export class GameSessionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly gameSessionsPublisherService: GameSessionsPublisherService,
  ) {}

  async beginGameSession(beginGameSessionParams: IBeginGameSessionParams): Promise<GameSession> {
    const { gameEventId, sessionDurationSeconds } = beginGameSessionParams;
    const gameSessionStartAt = dateTime.now();
    const gameSessionFinishAt = gameSessionStartAt.plus({ seconds: sessionDurationSeconds });

    return await this.prismaService.$transaction(async client => {
      const gameSession = await client.gameSession.create({
        data: {
          startAt: gameSessionStartAt.toString(),
          finishAt: gameSessionFinishAt.toString(),
          isFinished: false,
          gameEvent: { connect: { id: gameEventId } },
        },
      });

      const payload: IEndGameSessionParams = { id: gameSession.id };
      const options: JobsOptions = { delay: calculateDelayByFutureTimestamp(gameSessionFinishAt) };
      // Schedule the game session end moment.
      // It is no need to stop children sessions because of these sessions will stop automatically.
      await this.gameSessionsPublisherService.publish(JobName.EndGameSession, payload, options);
      return gameSession;
    });
  }

  async endGameSession(endGameSessionParams: IEndGameSessionParams): Promise<GameSession> {
    const gameSession = await this.markGameSessionAsFinished(endGameSessionParams);
    return gameSession;
  }

  async get(getGameSessionParams: GameServiceV1.GetGameSessionParamsDto): Promise<GameSession> {
    return await this.prismaService.gameSession.findUniqueOrThrow({ where: getGameSessionParams });
  }

  async listGameSessions(
    listGameSessionsParams: GameServiceV1.ListGameSessionsParamsDto,
  ): Promise<[GameSession[], number]> {
    const where: Prisma.GameSessionWhereInput = {};

    if (listGameSessionsParams.gameEventId) {
      where.gameEventId = listGameSessionsParams.gameEventId;
    }

    const whereWithoutStateFiltering = { ...where };

    if (listGameSessionsParams.isFinished !== undefined) {
      where.isFinished = listGameSessionsParams.isFinished;
    }

    const [items, total] = await Promise.all([
      this.prismaService.gameSession.findMany({ where }),
      this.prismaService.gameSession.count({ where: { ...whereWithoutStateFiltering } }),
    ]);

    return [items, total];
  }

  async markGameSessionAsFinished(
    data: Pick<GameSession, 'id'>,
    client: Prisma.TransactionClient = this.prismaService,
  ) {
    return await client.gameSession.update({
      data: {
        ...data,
        isFinished: true,
      },
      where: {
        id: data.id,
        isFinished: false,
      },
    });
  }
}
