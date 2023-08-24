/*
  Warnings:

  - You are about to drop the column `currency` on the `wallet_entries` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "wallet"."wallet_entries" DROP COLUMN "currency";
