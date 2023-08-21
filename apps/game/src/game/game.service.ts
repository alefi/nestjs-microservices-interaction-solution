import { Injectable } from '@nestjs/common';
import { Game, GameEvent, Prisma } from '@prisma/client';

import { PrismaService } from '@lib/db';
import { GameServiceV1, StructV1 } from '@lib/grpc';

@Injectable()
export class GameService {
  constructor(private readonly prismaService: PrismaService) {}

  async beginGameEvent(beginGameEventParams: GameServiceV1.BeginGameEventParamsDto): Promise<GameEvent> {
    // TODO It might be better to move an object creation into some mapping factory
    const { gameId, ...rest } = beginGameEventParams;
    const gameEvent = await this.prismaService.gameEvent.create({
      data: {
        ...rest,
        isFinished: false,
        game: { connect: { id: gameId } },
      },
    });

    // TODO Emit a domain message here. Probably, create an interactive transaction and do emit from there.

    return gameEvent;
  }

  async endGameEvent(endGameEventParams: GameServiceV1.EndGameEventParamsDto): Promise<GameEvent> {
    const gameEvent = await this.prismaService.gameEvent.update({
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

    // TODO Emit a domain message here. Probably, create an interactive transaction and do emit from there.

    return gameEvent;
  }

  async getGameEventById(getEntityByIdParams: StructV1.GetEntityByIdParamsDto): Promise<GameEvent> {
    return await this.prismaService.gameEvent.findUniqueOrThrow({ where: getEntityByIdParams });
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

  async listGames(listGamesParams: GameServiceV1.ListGamesParamsDto): Promise<[Game[], number]> {
    const where: Prisma.GameWhereInput = {};

    if (listGamesParams.isAvailable !== undefined) {
      where.isAvailable = listGamesParams.isAvailable;
    }

    const [items, total] = await Promise.all([
      this.prismaService.game.findMany({ where }),
      this.prismaService.game.count(),
    ]);

    return [items, total];
  }
}
