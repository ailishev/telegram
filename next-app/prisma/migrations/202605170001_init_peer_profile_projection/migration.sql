CREATE TYPE "PeerKind" AS ENUM ('user', 'chat', 'channel');

CREATE TABLE "peer_profiles" (
  "peer_id" TEXT PRIMARY KEY,
  "kind" "PeerKind" NOT NULL,
  "display_name" TEXT NOT NULL,
  "username" TEXT,
  "avatar_url" TEXT,
  "status_text" TEXT,
  "bio" TEXT,
  "is_forum" BOOLEAN NOT NULL DEFAULT false,
  "is_topic" BOOLEAN NOT NULL DEFAULT false,
  "has_saved_music" BOOLEAN NOT NULL DEFAULT false,
  "stats_json" JSONB,
  "badges_json" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "peer_profile_stories" (
  "id" TEXT PRIMARY KEY,
  "peer_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "payload" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "peer_profile_stories_peer_id_fkey" FOREIGN KEY ("peer_id") REFERENCES "peer_profiles"("peer_id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "peer_profile_stories_peer_id_idx" ON "peer_profile_stories"("peer_id");

CREATE TABLE "peer_profile_gifts" (
  "id" TEXT PRIMARY KEY,
  "peer_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "payload" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "peer_profile_gifts_peer_id_fkey" FOREIGN KEY ("peer_id") REFERENCES "peer_profiles"("peer_id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "peer_profile_gifts_peer_id_idx" ON "peer_profile_gifts"("peer_id");

CREATE TABLE "peer_profile_music" (
  "id" TEXT PRIMARY KEY,
  "peer_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "payload" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "peer_profile_music_peer_id_fkey" FOREIGN KEY ("peer_id") REFERENCES "peer_profiles"("peer_id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "peer_profile_music_peer_id_idx" ON "peer_profile_music"("peer_id");
