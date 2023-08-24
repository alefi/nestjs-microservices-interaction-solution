import { Injectable } from '@nestjs/common';

import { type GameSession, Prisma } from '@prisma/client';
import { PrismaService } from '@lib/db';
import { type GameServiceV1 } from '@lib/grpc';

@Injectable()
export class GameSessionService {
  constructor(private readonly prismaService: PrismaService) {}

  async getGameSessionById(getGameSessionParams: GameServiceV1.GetGameSessionParamsDto): Promise<GameSession> {
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
}
