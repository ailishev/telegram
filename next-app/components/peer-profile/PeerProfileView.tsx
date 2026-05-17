import type {PeerProfileResponse} from '@/types/peer-profile';

export default function PeerProfileView(props: {profile: PeerProfileResponse}) {
  const {profile} = props;

  return (
    <main style={{padding: 24, fontFamily: 'Inter, sans-serif', maxWidth: 820, margin: '0 auto'}}>
      <header style={{marginBottom: 24, borderBottom: '1px solid #ddd', paddingBottom: 12}}>
        <h1 style={{margin: 0}}>{profile.header.title}</h1>
        <p style={{margin: '6px 0 0', color: '#666'}}>{profile.header.subtitle || '—'}</p>
        <p style={{margin: '6px 0 0', color: '#666'}}>Peer ID: {profile.peerId}</p>
      </header>

      <section style={{marginBottom: 20}}>
        <h2>Flags</h2>
        <ul>
          <li>isForum: {String(profile.flags.isForum)}</li>
          <li>isTopic: {String(profile.flags.isTopic)}</li>
          <li>hasSavedMusic: {String(profile.flags.hasSavedMusic)}</li>
        </ul>
      </section>

      <section style={{marginBottom: 20}}>
        <h2>About</h2>
        <p>{profile.sections.about.bio || 'No bio'}</p>
      </section>

      <section style={{marginBottom: 20}}>
        <h2>Stories</h2>
        <ul>
          {profile.sections.stories.map((item) => (
            <li key={item.id}>{item.title || item.id}</li>
          ))}
        </ul>
      </section>

      <section style={{marginBottom: 20}}>
        <h2>Gifts</h2>
        <ul>
          {profile.sections.gifts.map((item) => (
            <li key={item.id}>{item.title || item.id}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Music</h2>
        <ul>
          {profile.sections.music.map((item) => (
            <li key={item.id}>{item.title || item.id}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
