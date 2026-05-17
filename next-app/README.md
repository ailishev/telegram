# next-app

Initial migration workspace for moving tweb to Next.js on Vercel.

## Current status

### Phase 1

- Next.js App Router bootstrap.
- API route skeleton for PeerProfile projection.

### Phase 2 (started)

- Added Prisma schema and first migration for projection tables:
  - `peer_profiles`
  - `peer_profile_stories`
  - `peer_profile_gifts`
  - `peer_profile_music`
- Added DB repository and Prisma client wiring.
- API now reads from DB first, with mock fallback when projection row is absent.

## Endpoints

- `GET /api/peer-profile/:peerId`
- `GET /api/peer-profile/:peerId/sections/:section`
