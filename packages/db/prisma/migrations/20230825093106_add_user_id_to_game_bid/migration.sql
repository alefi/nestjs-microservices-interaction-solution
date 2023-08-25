/*
  Warnings:

  - Added the required column `user_id` to the `bids` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "gaming"."bids" ADD COLUMN     "user_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "gaming"."bids" ADD CONSTRAINT "bids_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
