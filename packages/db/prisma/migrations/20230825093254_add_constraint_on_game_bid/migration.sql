/*
  Warnings:

  - A unique constraint covering the columns `[game_session_id,user_id]` on the table `bids` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "bids_game_session_id_user_id_key" ON "gaming"."bids"("game_session_id", "user_id");
