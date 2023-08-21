-- AlterTable
ALTER TABLE "gaming"."game_events" ADD COLUMN     "cancellation_reason" TEXT,
ADD COLUMN     "is_cancelled" BOOLEAN NOT NULL DEFAULT false;
