import {prisma} from '@/lib/server/prisma';
import type {PeerProfileResponse} from '@/types/peer-profile';

export async function getPeerProfileFromDb(peerId: string): Promise<PeerProfileResponse | null> {
  const row = await prisma.peerProfile.findUnique({
    where: {peerId},
    include: {
      stories: true,
      gifts: true,
      music: true
    }
  });

  if(!row) {
    return null;
  }

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
