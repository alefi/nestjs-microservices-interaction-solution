import { faker } from '@faker-js/faker';

import { AuthMethod, Currency, PrismaClient, Status } from '@prisma/client';
import { buildUrn } from '@lib/utils';
import {
  game1Id,
  game2Id,
  user1Id,
  user2Id,
  walletAccount1Id,
  walletAccount2Id,
  walletAccount3Id,
  walletAccount1Entry1Id,
  walletAccount2Entry1Id,
  walletAccount3Entry1Id,
} from './identifiers.constants.json';

const buildTopUpUrn = ({
  service = 'top_up_service',
  type = 'earning',
  id,
}: {
  service?: string;
  type?: string;
  id: string;
}): string => buildUrn(service, type, id);

const seedGamesDb = async (prisma: PrismaClient) => {
  await prisma.game.upsert({
    where: { id: game1Id },
    update: {},
    create: {
      id: game1Id,
      name: 'Guess the number',
      isAvailable: true,
      createdAt: faker.date.past(),
      updatedAt: new Date(),
    },
  });
  await prisma.game.upsert({
    where: { id: game2Id },
    update: {},
    create: {
      id: game2Id,
      name: 'Marriage',
      isAvailable: false,
      createdAt: faker.date.past(),
      updatedAt: new Date(),
    },
  });

  console.info('Games database seeded');
};

const seedUsersWithWalletAccountsDb = async (prisma: PrismaClient) => {
  await prisma.user.upsert({
    where: { id: user1Id },
    update: {},
    create: {
      id: user1Id,
      name: 'Sylvia',
      displayName: 'Sylvia the princess',
      authMethod: AuthMethod.local,
      email: faker.internet.email(),
      isEmailConfirmed: true,
      isActive: true,
      walletAccounts: {
        connectOrCreate: [
          {
            where: { id: walletAccount1Id },
            create: {
              id: walletAccount1Id,
              currency: Currency.RUR,
              isAvailable: true,
              createdAt: faker.date.past(),
              updatedAt: new Date(),
            },
          },
          {
            where: { id: walletAccount2Id },
            create: {
              id: walletAccount2Id,
              currency: Currency.USD,
              isAvailable: false,
              createdAt: faker.date.past(),
              updatedAt: new Date(),
            },
          },
        ],
      },
      createdAt: faker.date.past(),
      updatedAt: new Date(),
    },
  });
  await prisma.user.upsert({
    where: { id: user2Id },
    update: {},
    create: {
      id: user2Id,
      name: 'Bob',
      displayName: 'Bob the gardener',
      authMethod: AuthMethod.local,
      diallingCode: '44',
      phoneNumber: faker.phone.number('501-###-###'),
      isPhoneConfirmed: true,
      isEmailConfirmed: false,
      isActive: true,
      walletAccounts: {
        connectOrCreate: {
          where: { id: walletAccount3Id },
          create: {
            id: walletAccount3Id,
            currency: Currency.USD,
            isAvailable: true,
            createdAt: faker.date.past(),
            updatedAt: new Date(),
          },
        },
      },
      createdAt: faker.date.past(),
      updatedAt: new Date(),
    },
  });

  console.info('Users and wallet_accounts databases seeded');
};

const seedWalletEntriesDb = async (prisma: PrismaClient) => {
  await prisma.walletEntry.upsert({
    where: { id: walletAccount1Entry1Id },
    update: {},
    create: {
      id: walletAccount1Entry1Id,
      reference: buildTopUpUrn({ id: 'da105576-5f74-44a1-9320-3640ece95cdd' }),
      amount: 10_500.0,
      currency: Currency.RUR,
      status: Status.success,
      postedAt: new Date(),
      walletAccount: {
        connect: {
          userId_currency: {
            currency: Currency.RUR,
            userId: user1Id,
          },
        },
      },
      createdAt: faker.date.past(),
      updatedAt: new Date(),
    },
  });
  await prisma.walletEntry.upsert({
    where: { id: walletAccount2Entry1Id },
    update: {},
    create: {
      id: walletAccount2Entry1Id,
      reference: buildTopUpUrn({ id: '7917d967-d8f9-45a9-a2b2-79de8e2bd9d3' }),
      amount: 500.5,
      currency: Currency.USD,
      status: Status.success,
      postedAt: new Date(),
      walletAccount: {
        connect: {
          userId_currency: {
            currency: Currency.USD,
            userId: user1Id,
          },
        },
      },
      createdAt: faker.date.past(),
      updatedAt: new Date(),
    },
  });
  await prisma.walletEntry.upsert({
    where: { id: walletAccount3Entry1Id },
    update: {},
    create: {
      id: walletAccount3Entry1Id,
      reference: buildTopUpUrn({ id: 'def0cebe-64e7-40a3-92e9-816f22850af4' }),
      amount: 253.3,
      currency: Currency.USD,
      status: Status.success,
      postedAt: new Date(),
      walletAccount: {
        connect: {
          userId_currency: {
            currency: Currency.USD,
            userId: user2Id,
          },
        },
      },
      createdAt: faker.date.past(),
      updatedAt: new Date(),
    },
  });

  console.info('User wallet account entries database seeded');
};

void (async () => {
  // It mustn't run on production environment.
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const prisma = new PrismaClient();
  await Promise.all([seedGamesDb(prisma), seedUsersWithWalletAccountsDb(prisma)]);
  await seedWalletEntriesDb(prisma);
})();
