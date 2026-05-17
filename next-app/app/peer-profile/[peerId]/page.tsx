import {notFound} from 'next/navigation';
import PeerProfileView from '@/components/peer-profile/PeerProfileView';
import {getPeerProfileFromDb} from '@/lib/server/peer-profile-repository';

export const dynamic = 'force-dynamic';

export default async function PeerProfilePage(props: {params: {peerId: string}}) {
  const {peerId} = props.params;
  const profile = await getPeerProfileFromDb(peerId);

  if(!profile) {
    notFound();
  }

  return <PeerProfileView profile={profile} />;
}
