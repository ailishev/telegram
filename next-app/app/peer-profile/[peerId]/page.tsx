import {notFound} from 'next/navigation';
import PeerProfileView from '@/components/peer-profile/PeerProfileView';
import type {PeerProfileResponse} from '@/types/peer-profile';

async function getPeerProfile(peerId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/peer-profile/${peerId}`, {
    cache: 'no-store'
  });

  if(response.status === 404) {
    return null;
  }

  if(!response.ok) {
    throw new Error('Failed to load peer profile');
  }

  return response.json() as Promise<PeerProfileResponse>;
}

export default async function PeerProfilePage(props: {params: Promise<{peerId: string}>}) {
  const {peerId} = await props.params;
  const profile = await getPeerProfile(peerId);

  if(!profile) {
    notFound();
  }

  return <PeerProfileView profile={profile} />;
}
