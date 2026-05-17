import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getChatById} from '@/lib/server/chat-repository';

export const dynamic = 'force-dynamic';

export default async function ChatPage(props: {params: Promise<{chatId: string}>}) {
  const {chatId} = await props.params;
  const chat = await getChatById(chatId);

  if(!chat) {
    notFound();
  }

  return (
    <main style={{padding: 20}}>
      <p><Link href="/chats">← Back to chats</Link></p>
      <h1>{chat.title}</h1>
      <p>{chat.subtitle || '—'}</p>
      <p>Kind: {chat.kind}</p>
      <p>
        Open peer profile: <Link href={`/peer-profile/${chat.id}`}>/peer-profile/{chat.id}</Link>
      </p>
    </main>
  );
}
