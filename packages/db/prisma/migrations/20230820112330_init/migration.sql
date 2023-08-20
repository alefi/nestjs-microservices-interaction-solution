-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "gaming";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "wallet";

-- CreateEnum
CREATE TYPE "auth"."auth_method" AS ENUM ('local', 'social');

-- CreateEnum
CREATE TYPE "public"."currency" AS ENUM ('RUR', 'USD');

-- CreateEnum
CREATE TYPE "public"."status" AS ENUM ('pending', 'success', 'failure');

-- CreateTable
CREATE TABLE "auth"."users" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "display_name" TEXT,
    "email" TEXT,
    "is_email_confirmed" BOOLEAN NOT NULL,
    "dialling_code" TEXT,
    "phone_number" TEXT,
    "is_phone_confirmed" BOOLEAN,
    "auth_method" "auth"."auth_method" NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gaming"."games" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "is_available" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gaming"."game_sessions" (
    "id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "start_at" TIMESTAMPTZ NOT NULL,
    "finish_at" TIMESTAMPTZ NOT NULL,
    "is_finished" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "game_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet"."wallet_accounts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "currency" "public"."currency" NOT NULL,
    "is_available" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "wallet_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet"."wallet_entries" (
    "id" UUID NOT NULL,
    "wallet_account_id" UUID NOT NULL,
    "reference" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" "public"."currency" NOT NULL,
    "status" "public"."status" NOT NULL,
    "posted_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "wallet_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_dialling_code_phone_number_is_phone_confirmed_key" ON "auth"."users"("dialling_code", "phone_number", "is_phone_confirmed");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_accounts_user_id_currency_key" ON "wallet"."wallet_accounts"("user_id", "currency");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_entries_reference_wallet_account_id_key" ON "wallet"."wallet_entries"("reference", "wallet_account_id");

-- AddForeignKey
ALTER TABLE "gaming"."game_sessions" ADD CONSTRAINT "game_sessions_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "gaming"."games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet"."wallet_accounts" ADD CONSTRAINT "wallet_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet"."wallet_entries" ADD CONSTRAINT "wallet_entries_wallet_account_id_fkey" FOREIGN KEY ("wallet_account_id") REFERENCES "wallet"."wallet_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
