import { faker } from '@faker-js/faker';

import { AuthMethod, Currency, PrismaClient } from '@prisma/client';
import {
  game1Id,
  game2Id,
  user1Id,
  user2Id,
  walletAccount1Id,
  walletAccount2Id,
  walletAccount3Id,
} from './identifiers.constants.json';

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
              currency: Currency.RUR,
              isAvailable: true,
              createdAt: faker.date.past(),
              updatedAt: new Date(),
            },
          },
          {
            where: { id: walletAccount2Id },
            create: {
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

void (async () => {
  // It mustn't run on production environment.
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const prisma = new PrismaClient();
  await Promise.all([seedGamesDb(prisma), seedUsersWithWalletAccountsDb(prisma)]);
})();
