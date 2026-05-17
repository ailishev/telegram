import {NextResponse} from 'next/server';
import {getMockPeerProfile} from '@/lib/mock-peer-profile';
import {getPeerProfileFromDb} from '@/lib/server/peer-profile-repository';

export async function GET(_request: Request, {params}: {params: Promise<{peerId: string}>}) {
  const {peerId} = await params;
  const fromDb = await getPeerProfileFromDb(peerId);
  return NextResponse.json(fromDb || getMockPeerProfile(peerId));
}
