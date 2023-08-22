import { Injectable, Logger } from '@nestjs/common';
import { GameEvent, Prisma } from '@prisma/client';

import { PrismaService } from '@lib/db';
import { type GameServiceV1 } from '@lib/grpc';
import { dateTime } from '@lib/utils';
import { GameEventsPublisherService, JobName } from '../../queue';

@Injectable()
export class GameEventService {
  private readonly logger = new Logger(GameEventService.name, { timestamp: true });

  constructor(
    private readonly prismaService: PrismaService,
    private readonly gameEventsPublisherService: GameEventsPublisherService,
  ) {}

  async beginGameEvent(beginGameEventParams: GameServiceV1.BeginGameEventParamsDto): Promise<GameEvent> {
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
      // TODO Add constraint validation, e.g., if time is in the past, etc
      const eventStartAt = dateTime.parse(gameEvent.startAt);
      const remainingTimeToEventStart = eventStartAt.diffNow();

      const { id: gameEventId, sessionDurationSeconds } = gameEvent;

      const payload = {
        gameEventId,
        sessionDurationSeconds,
      };
      const options = { delay: remainingTimeToEventStart.toMillis() };

      const job = await this.gameEventsPublisherService.publish(JobName.GameEventBeginning, payload, options);
      this.logger.debug(`Published job id ${job.id}`);

      return gameEvent;
    });
  }

  async endGameEvent(endGameEventParams: GameServiceV1.EndGameEventParamsDto): Promise<GameEvent> {
    return await this.prismaService.$transaction(async client => {
      const gameEvent = await client.gameEvent.update({
        data: {
          ...endGameEventParams,
          isCancelled: true,
          isFinished: true,
        },
        where: {
          id: endGameEventParams.id,
          isFinished: false,
        },
      });

      // TODO It might be better to move an object creation into some mapping factory
      const payload = {
        gameEventId: gameEvent.id,
        isCancelled: true, // TODO Calculate this using cancellationReason prop along with checking finishAt timestamp property
      };

      const job = await this.gameEventsPublisherService.publish(JobName.GameEventEnding, payload);
      this.logger.debug(`Published job id ${job.id}`);

      return gameEvent;
    });
  }

  async getGameEventById(getGameEventParams: GameServiceV1.GetGameEventParamsDto): Promise<GameEvent> {
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
}
