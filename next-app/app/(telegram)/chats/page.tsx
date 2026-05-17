import Link from 'next/link';
import {listChats} from '@/lib/server/chat-repository';

export const dynamic = 'force-dynamic';

export default async function ChatsPage() {
  const chats = await listChats(50);

  return (
    <main style={{padding: 20}}>
      <h1 style={{marginTop: 0}}>Chats</h1>
      <ul style={{display: 'grid', gap: 12, listStyle: 'none', padding: 0}}>
        {chats.map((chat) => (
          <li key={chat.id} style={{border: '1px solid #e5e5e5', borderRadius: 8, padding: 12}}>
            <Link href={`/chat/${chat.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
              <strong>{chat.title}</strong>
              <div style={{fontSize: 13, color: '#666'}}>{chat.subtitle || '—'}</div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
