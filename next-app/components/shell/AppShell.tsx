import type {ReactNode} from 'react';
import Link from 'next/link';

export default function AppShell(props: {children: ReactNode}) {
  return (
    <div style={{display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh', fontFamily: 'Inter, sans-serif'}}>
      <aside style={{borderRight: '1px solid #ddd', padding: 16}}>
        <h2 style={{marginTop: 0}}>tweb Next</h2>
        <nav style={{display: 'grid', gap: 8}}>
          <Link href="/">Home</Link>
          <Link href="/chats">Chats</Link>
        </nav>
      </aside>
      <div>{props.children}</div>
    </div>
  );
}
