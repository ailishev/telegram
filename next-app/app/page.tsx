import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{padding: 24, fontFamily: 'Inter, sans-serif'}}>
      <h1>tweb Next.js migration sandbox</h1>
      <p>Phase 5 started: route structure migrated with shell/chats/chat pages.</p>
      <ul>
        <li><Link href="/chats">/chats</Link></li>
        <li><Link href="/peer-profile/demo-user">/peer-profile/demo-user</Link></li>
      </ul>
    </main>
  );
}
