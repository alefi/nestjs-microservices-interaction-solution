-- Create unsupported by Prisma partial index.
CREATE UNIQUE INDEX "wallet_entries_state_wallet_account_id" ON "wallet"."wallet_entries"("state", "wallet_account_id") WHERE "state" != 'confirmed' OR "state" != 'failed';
