import { Injectable } from '@nestjs/common';
import type { JobsOptions } from 'bullmq';

import { type GameSession, Prisma } from '@prisma/client';
import { PrismaService } from '@lib/db';
import { type GameServiceV1 } from '@lib/grpc';
import { IBeginGameSessionParams, IEndGameSessionParams, IProcessGameBidsParams, JobName, QueueName } from '@lib/queue';
import { dateTime, hashValue } from '@lib/utils';
import { GameBidsPublisherService } from '../../../queue';
import { calculateDelayByFutureTimestamp } from '../helpers';
import { IGameSessionActionResult } from './typings';

@Injectable()
export class GameSessionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly gameBidsPublisherService: GameBidsPublisherService,
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

      const opts: JobsOptions = { delay: calculateDelayByFutureTimestamp(gameSessionFinishAt) };
      // Schedule the game session end moment and further game tribute processing as well.
      // It is no need to stop children sessions because of these sessions will stop automatically.
      await this.gameBidsPublisherService.publishFlow(
        JobName.ProcessGameBids,
        <IProcessGameBidsParams>{ gameSessionId: gameSession.id },
        [
          {
            name: JobName.EndGameSession,
            data: <IEndGameSessionParams>{ id: gameSession.id },
            queueName: QueueName.GameSessions,
            opts,
          },
        ],
      );

      return gameSession;
    });
  }

  async endGameSession(endGameSessionParams: IEndGameSessionParams): Promise<GameSession> {
    const gameSessionResult = this.performAction(endGameSessionParams.id);
    return await this.markGameSessionAsFinished(endGameSessionParams, gameSessionResult);
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

  async markGameSessionAsFinished(data: IEndGameSessionParams, sessionResultData: IGameSessionActionResult) {
    return await this.prismaService.gameSession.update({
      data: {
        ...data,
        ...sessionResultData,
        isFinished: true,
      },
      where: {
        id: data.id,
        isFinished: false,
      },
    });
  }

  // Note: This action is hardcoded for a specific game we using for this demo.
  // This method shouldn't be a part of this service at all.
  private performAction(sessionId: string): IGameSessionActionResult {
    /**
     * The maximum is inclusive and the minimum is inclusive.
     */
    const getRandomIntInclusive = (min: number, max: number) => {
      min = Math.ceil(min);
      max = Math.floor(max);

      return Math.floor(Math.random() * (max - min + 1) + min);
    };

    const winningValue = getRandomIntInclusive(1, 3);
    const winningHash = hashValue(winningValue.toString(), sessionId);

    return { winningHash };
  }
}
