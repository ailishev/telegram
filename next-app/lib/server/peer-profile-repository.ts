import {getPrisma} from '@/lib/server/prisma';
import type {PeerProfileResponse, PeerProfileSection} from '@/types/peer-profile';

function toResponse(row: Awaited<ReturnType<ReturnType<typeof getPrisma>['peerProfile']['findUniqueOrThrow']>>): PeerProfileResponse {
  return {
    peerId: row.peerId,
    kind: row.kind,
    header: {
      title: row.displayName,
      subtitle: row.username ? `@${row.username}` : row.statusText || '',
      avatar: row.avatarUrl
    },
    flags: {
      isForum: row.isForum,
      isTopic: row.isTopic,
      hasSavedMusic: row.hasSavedMusic
    },
    sections: {
      about: {
        bio: row.bio || ''
      },
      stories: row.stories.map((item) => ({id: item.id, title: item.title})),
      gifts: row.gifts.map((item) => ({id: item.id, title: item.title})),
      music: row.music.map((item) => ({id: item.id, title: item.title}))
    }
  };
}

export async function getPeerProfileFromDb(peerId: string): Promise<PeerProfileResponse | null> {
  if(!process.env.DATABASE_URL) {
    return null;
  }

  const row = await getPrisma().peerProfile.findUnique({
    where: {peerId},
    include: {
      stories: {orderBy: {createdAt: 'desc'}},
      gifts: {orderBy: {createdAt: 'desc'}},
      music: {orderBy: {createdAt: 'desc'}}
    }
  });

  return row ? toResponse(row) : null;
}

export async function getPeerProfileSectionFromDb(peerId: string, section: PeerProfileSection) {
  const profile = await getPeerProfileFromDb(peerId);
  if(!profile) {
    return null;
  }

  return profile.sections[section];
}

export async function listPeerProfilesFromDb(limit = 20, cursor?: string) {
  if(!process.env.DATABASE_URL) {
    return {items: [], nextCursor: null};
  }

  const rows = await getPrisma().peerProfile.findMany({
    take: Math.max(1, Math.min(limit, 100)),
    ...(cursor ? {skip: 1, cursor: {peerId: cursor}} : {}),
    orderBy: {updatedAt: 'desc'}
  });

  const nextCursor = rows.length ? rows[rows.length - 1].peerId : null;
  return {
    items: rows.map((row) => ({
      peerId: row.peerId,
      kind: row.kind,
      displayName: row.displayName,
      username: row.username,
      updatedAt: row.updatedAt.toISOString()
    })),
    nextCursor
  };
}
