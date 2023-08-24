/*
  Warnings:

  - Added the required column `state` to the `wallet_entries` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "wallet"."wallet_entry_state" AS ENUM ('reserved', 'cancelled', 'confirmed', 'failed');

-- AlterTable
ALTER TABLE "wallet"."wallet_entries" ADD COLUMN     "state" "wallet"."wallet_entry_state" NOT NULL;
