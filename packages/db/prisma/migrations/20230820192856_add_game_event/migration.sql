/*
  Warnings:

  - You are about to drop the column `game_id` on the `game_sessions` table. All the data in the column will be lost.
  - Added the required column `game_event_id` to the `game_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "gaming"."game_sessions" DROP CONSTRAINT "game_sessions_game_id_fkey";

-- AlterTable
ALTER TABLE "gaming"."game_sessions" DROP COLUMN "game_id",
ADD COLUMN     "game_event_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "gaming"."games" ADD COLUMN     "simultaneous_events_count" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "gaming"."game_events" (
    "id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "simultaneous_sessions_count" INTEGER NOT NULL DEFAULT 1,
    "start_at" TIMESTAMPTZ NOT NULL,
    "finish_at" TIMESTAMPTZ NOT NULL,
    "is_finished" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "game_events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "gaming"."game_events" ADD CONSTRAINT "game_events_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "gaming"."games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gaming"."game_sessions" ADD CONSTRAINT "game_sessions_game_event_id_fkey" FOREIGN KEY ("game_event_id") REFERENCES "gaming"."game_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
