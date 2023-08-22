-- AlterTable
ALTER TABLE "gaming"."game_events" ADD COLUMN     "sessions_count_limit" INTEGER;

-- AlterTable
ALTER TABLE "gaming"."game_sessions" ADD COLUMN     "winning_hash" TEXT;
