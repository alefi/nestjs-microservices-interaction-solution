-- CreateTable
CREATE TABLE "gaming"."bids" (
    "id" UUID NOT NULL,
    "game_session_id" UUID NOT NULL,
    "wallet_entry_id" UUID NOT NULL,
    "status" "public"."status" NOT NULL,
    "value_hash" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "bids_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bids_value_hash_status_idx" ON "gaming"."bids"("value_hash", "status");

-- AddForeignKey
ALTER TABLE "gaming"."bids" ADD CONSTRAINT "bids_game_session_id_fkey" FOREIGN KEY ("game_session_id") REFERENCES "gaming"."game_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gaming"."bids" ADD CONSTRAINT "bids_wallet_entry_id_fkey" FOREIGN KEY ("wallet_entry_id") REFERENCES "wallet"."wallet_entries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
