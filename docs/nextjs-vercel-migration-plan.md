# Next.js + Vercel migration blueprint for tweb

## Goal

This document defines a full migration strategy from the current Solid.js + MTProto-in-browser architecture to a Next.js architecture deployable on Vercel, while preserving UI behavior and replacing Telegram-bound `PeerProfile` data sourcing with a database-backed projection layer.

## Constraints

- Keep existing visual logic and interaction semantics.
- Move backend integration to Vercel-compatible runtimes.
- Replace direct Telegram-derived `PeerProfile` reads with DB-backed reads via a projection API.

## Target architecture

1. **Frontend**: Next.js App Router (`app/`) with React Server Components + client components for interactive panels.
2. **Backend**: Next.js Route Handlers (`app/api/*`) + Vercel serverless/edge functions.
3. **Data layer**: Postgres (Neon/Supabase) via Prisma.
4. **Caching**: Vercel KV + ISR/revalidate tags for profile slices.
5. **Realtime**: WebSocket bridge (separate service) or polling + incremental updates for Vercel constraints.

## PeerProfile migration (DB projection)

### Current behavior to preserve

`PeerProfile` currently composes:
- avatar state
- name/subtitle/status blocks
- media/stories/gifts/music derived sections
- contextual behavior by `peerId`, `threadId`, and flags (`forum`, `saved dialog`, etc.)

### New source of truth

Introduce `peer_profiles` projection table with denormalized fields used by UI:

- `peer_id` (PK)
- `type` (`user|chat|channel`)
- `display_name`
- `username`
- `avatar_url`
- `status_text`
- `bio`
- `stats_json`
- `badges_json`
- `updated_at`

And optional dependent tables:
- `peer_profile_stories`
- `peer_profile_gifts`
- `peer_profile_music`

### API contract

- `GET /api/peer-profile/:peerId`
- `GET /api/peer-profile/:peerId/sections/:section`

Response should mirror UI-needed shape, not Telegram schema:

```json
{
  "peerId": "...",
  "kind": "user",
  "header": {
    "title": "...",
    "subtitle": "...",
    "avatar": "..."
  },
  "flags": {
    "isForum": false,
    "isTopic": false,
    "hasSavedMusic": true
  },
  "sections": {
    "about": {},
    "stories": [],
    "gifts": [],
    "music": []
  }
}
```

## Incremental migration phases

1. **Phase 0**: Freeze current `PeerProfile` visual contract with snapshot tests.
2. **Phase 1**: Build Next.js shell + shared design tokens/styles.
3. **Phase 2**: Add Prisma schema + migrations + seed adapters.
4. **Phase 3**: Implement projection read APIs.
5. **Phase 4**: Port `PeerProfile` UI to Next.js preserving render logic.
6. **Phase 5**: Move remaining panels and route structure.
7. **Phase 6**: Enable Vercel deployment pipelines and observability.

## Vercel deployment checklist

- Set `DATABASE_URL`, `DIRECT_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`.
- Configure build command: `pnpm build`.
- Configure postinstall: `prisma generate`.
- Add cron (optional) for projection refresh jobs.
- Add Sentry/Logflare for runtime diagnostics.

## Risks

- Full MTProto parity in Vercel serverless may require external persistent worker(s).
- Large stateful flows (realtime dialogs) may need a hybrid architecture.
- UI parity requires visual regression checks per major panel.

## Recommended next execution task

Start with **Phase 0 + Phase 1** in a dedicated branch:
- lock behavior with snapshots for current `PeerProfile`
- scaffold Next.js app in `/next-app`
- implement first DB-backed `peer-profile` endpoint with mocked data

## Progress update (2026-05-17)

- ✅ Phase 1 started: `next-app` scaffold and API route shape created.
- ✅ Phase 2 started: Prisma projection schema + initial SQL migration + DB-backed repository with API fallback behavior.

- ✅ Phase 3 started: projection read APIs implemented with DB-only reads, pagination endpoint, and explicit not-found semantics.
- ✅ Phase 4 started: initial Next.js PeerProfile page ported with DB-projection API integration and not-found handling.
- ✅ Phase 5 started: route structure and base shell scaffold ported (`/chats`, `/chat/:chatId`) using projection-backed reads.
- ✅ Phase 6 started: Vercel deployment config, env template, healthcheck API, and structured logging baseline added.
- ✅ Deployment fix: root Vercel build now targets `next-app` (`pnpm --dir next-app vercel-build`) to avoid building legacy Vite app on Vercel.
