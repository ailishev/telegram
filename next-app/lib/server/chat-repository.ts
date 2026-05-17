import {getPrisma} from '@/lib/server/prisma';

export async function listChats(limit = 30) {
  const rows = await getPrisma().peerProfile.findMany({
    take: Math.max(1, Math.min(limit, 100)),
    orderBy: {updatedAt: 'desc'}
  });

  return rows.map((item) => ({
    id: item.peerId,
    title: item.displayName,
    subtitle: item.username ? `@${item.username}` : item.statusText || '',
    kind: item.kind
  }));
}

export async function getChatById(chatId: string) {
  const row = await getPrisma().peerProfile.findUnique({where: {peerId: chatId}});
  if(!row) {
    return null;
  }

  return {
    id: row.peerId,
    title: row.displayName,
    subtitle: row.username ? `@${row.username}` : row.statusText || '',
    kind: row.kind
  };
}
