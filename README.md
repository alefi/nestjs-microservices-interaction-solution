# Sample NestJS microservices integration POC solution

## Requirements

Create a sample application set which conforms the following requirements (the following paragraph in the Russian language):

Wallet - кошельки(балансы),
Game - написать аналог игры: ставки, таймер, работа с балансом(успешные ставки/победа, так же эмулировать ошибки и отработать их чтобы деньги пользователя не потерялись)
[example](https://ezcash21.casino/classic/main)

## Overview

This project build on [Turborepo](https://turborepo.org/).

### What's inside?

This turborepo uses [NPM](https://www.npmjs.com/) as a package manager. It includes the following apps/packages:

### Apps and Packages

- [gw-web](./apps/gw-web): a [NextJs](https://nextjs.org/) Bff gateway facade application for Web clients
- [game](./apps/game): a sample [NestJs](https://nestjs.com/) app which performs a gameplay
- [user](./apps/user): a [NestJs](https://nestjs.com/) app which manages user accounts
- [wallet](./apps/wallet): a [NestJs](https://nestjs.com/) app which manages wallet accounts
- `@lib/db`: a [Prisma](https://prisma.io/) based [NextJs](https://nextjs.org/) component that intended to operate over the database
- `@lib/grpc`: a gRPC common component containing all the protobuf files and dynamic types and event code, generated from those protobuf files
- `@lib/utils`: set of common utils
- `eslint-config-custom`: `eslint` and `prettier` configurations
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

> 📝 _Each app/package is 100% [TypeScript](https://www.typescriptlang.org/)._

### Utilities

This turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Further improvements

This code is provided as a PoC and it could be improved. For instance:

- add auth service, that would be used asymmetric keys as a secret; cover endpoints by authorisation
- add tests for real business cases
- better exception handling, including creation of business level exceptions and map them on appropriated layers
- use some accounting library for financial operations
- get rid of DRY principle violation in several places on codebase
- use [Temporal](https://temporal.io) for a process orchestration

## Techniques

This chapter contains minor notice regarding to approaches.

### gRPС

The microservices interact with each other using a direct gRpc call as a primary transport layer. However, there is an additional interaction method based on the BullMQ queues. As you can notice, there is a lot of code related to gRpc. But don't be afraid, most of that code is auto-generated, since the code in the repository is based on the code-first approach. [How to build types from protobuf files?](./packages/grpc/README.md)

### Open API

The Open API document is available by relative path `<HOST:WEB_GATEWAY_SERVICE_HTTP_PORT>/docs` (e.g. `localhost:3000/docs`).

TODO Append the Postman document for be able testing locally.

## Usage

Please read this section carefully.

### Environment variables

- `NODE_ENV`: (optional)
- `DATABASE_URL`: Services use it for connecting to a database
- `REDIS_HOST`: The game service use Redis to manage task queue; host to connect
- `REDIS_PORT`: The game service use Redis to manage task queue; port to connect
- `GAME_SERVICE_GRPC_URL`: Url for connecting to game service through the gRpc transport
- `USER_SERVICE_GRPC_URL`: Url for connecting to user service through the gRpc transport
- `WALLET_SERVICE_GRPC_URL`: Url for connecting to wallet service through the gRpc transport
- `WEB_GATEWAY_SERVICE_HTTP_PORT`: Port that used by [gw-web](./apps/gw-web/) service to handle client conntecions

> 📝 _Please take a look at provided [env.example](./.env.example) file located at the project root level._

### Initialisation

To make sure everithing works fine, copy [.env.example](./.env.example) file into `.env.local` and adjust settings inside according section above. This step doesn't required for run applications locally, since in that case the `dev.env` file would be used.

To first-time initialize the repository, run the following commands:

```console
npm i
npm run build
```

It installs dependencies and build all components.

### Run tests

> 📝 _Make sure no local Hardhat node is running._

```console
npm run test
```

### Run locally

> 📝 _Make sure nodejs and npm are installed._

It needs that Postgres and Redis instances accept connections. This repository has a [docker-compose](./docker/docker-compose.yaml) file for easily run Postgres and Redis locally.

```console
cd docker
docker-compose up --detach
```

It also needs to migrate database state. For a development purpose the database seeding also supported.

```console
npm -w @lib/db run db:migrate
```

The following step is optional (it will seed the database):

```console
npm -w @lib/db run db:seed
```

To run all applications and services at-once, type:

```console
npm run dev
```

or, to precisely run only the client application, run the following command:

```console
npm -w gw-web run dev
```

### Add or update dependencies

To add or update a dependency, add -w parameter with a corresponding name-space. Do not use the NPM in the former manner (without the name-space specifying):

```console
npm -w <namespace> ...<rest_args>
```

### Troubleshooting

In case of weird compilation errors, it could be helpful to clean and rebuild apps/packages:

```console
npm run clean
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turborepo.org/docs/features/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```console
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link this repo to your Remote Cache by running the following command from the root of your turborepo:

```console
npx turbo link
```

#### Cache troubleshooting

When you use turbo with tools that inline environment variables at build time (e.g. Next.js or Create React App), it is important to tell turbo about it. Otherwise, you could ship a cached build with the wrong environment variables! [Details](https://turbo.build/repo/docs/core-concepts/caching#altering-caching-based-on-environment-variables)

The cache strategy depends on `APP_ENV` and it is configured in `turbo.json`

## Useful Links

Learn more about the power of Turborepo:

- [Pipelines](https://turborepo.org/docs/features/pipelines)
- [Caching](https://turborepo.org/docs/features/caching)
- [Remote Caching](https://turborepo.org/docs/features/remote-caching)
- [Scoped Tasks](https://turborepo.org/docs/features/scopes)
- [Configuration Options](https://turborepo.org/docs/reference/configuration)
- [CLI Usage](https://turborepo.org/docs/reference/command-line-reference)
