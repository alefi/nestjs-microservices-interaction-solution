import { Injectable } from '@nestjs/common';
import { Game, Prisma } from '@prisma/client';

import { GameServiceV1 } from '@lib/grpc';
import { PrismaService } from '@lib/db';

@Injectable()
export class GameService {
  constructor(private readonly prismaService: PrismaService) {}

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
