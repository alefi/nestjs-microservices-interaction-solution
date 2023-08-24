import { Injectable } from '@nestjs/common';
import { JobsOptions } from 'bullmq';

import { type GameEvent, Prisma } from '@prisma/client';
import { PrismaService } from '@lib/db';
import { type GameServiceV1 } from '@lib/grpc';
import { IBeginGameEventParams, IEndGameEventParams, JobName } from '@lib/queue';
import { GameEventsPublisherService } from '../../queue';
import { calculateDelayByFutureTimestamp, checkGameEventConstraints } from './helpers';

@Injectable()
export class GameEventService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly gameEventsPublisherService: GameEventsPublisherService,
  ) {}

  async beginGameEvent(beginGameEventParams: GameServiceV1.BeginGameEventParamsDto): Promise<GameEvent> {
    checkGameEventConstraints(beginGameEventParams);

    return await this.prismaService.$transaction(async client => {
      const { gameId, ...rest } = beginGameEventParams;
      const gameEvent = await client.gameEvent.create({
        data: {
          ...rest,
          isFinished: false,
          game: { connect: { id: gameId } },
        },
      });

      // TODO It might be better to move an object creation into some mapping factory
      const { id, finishAt, sessionsCountLimit, sessionDurationSeconds, simultaneousSessionsCount, startAt } =
        gameEvent;
      const payload: IBeginGameEventParams = {
        id,
        gameId,
        finishAt,
        sessionsCountLimit,
        sessionDurationSeconds,
        simultaneousSessionsCount,
      };
      const options: JobsOptions = { delay: calculateDelayByFutureTimestamp(startAt) };
      options.delay = 0; // TODO Remove after testing phase and add options to method call
      await this.gameEventsPublisherService.publish(JobName.BeginGameEvent, payload);
      return gameEvent;
    });
  }

  async endGameEvent(endGameEventParams: GameServiceV1.EndGameEventParamsDto): Promise<GameEvent> {
    return await this.prismaService.$transaction(async client => {
      const gameEvent = await this.markGameEventAsFinished(endGameEventParams, client);

      // TODO It might be better to move an object creation into some mapping factory
      const payload: IEndGameEventParams = {
        id: gameEvent.id,
        isCancelled: gameEvent.isCancelled,
      };
      await this.gameEventsPublisherService.publish(JobName.EndGameEvent, payload);
      return gameEvent;
    });
  }

  async get(getGameEventParams: GameServiceV1.GetGameEventParamsDto): Promise<GameEvent> {
    return await this.prismaService.gameEvent.findUniqueOrThrow({ where: getGameEventParams });
  }

  async listGameEvents(listGameEventsParams: GameServiceV1.ListGameEventsParamsDto): Promise<[GameEvent[], number]> {
    const where: Prisma.GameEventWhereInput = {};

    if (listGameEventsParams.gameId) {
      where.gameId = listGameEventsParams.gameId;
    }

    const whereWithoutStateFiltering = { ...where };

    if (listGameEventsParams.isFinished !== undefined) {
      where.isFinished = listGameEventsParams.isFinished;
    }

    const [items, total] = await Promise.all([
      this.prismaService.gameEvent.findMany({ where }),
      this.prismaService.gameEvent.count({ where: { ...whereWithoutStateFiltering } }),
    ]);

    return [items, total];
  }

  async markGameEventAsFinished(
    data: Pick<GameEvent, 'id' | 'isCancelled'> & Partial<Pick<GameEvent, 'cancellationReason'>>,
    client: Prisma.TransactionClient = this.prismaService,
  ) {
    return await client.gameEvent.update({
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
