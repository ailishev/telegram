import {NextResponse} from 'next/server';
import {getPeerProfileFromDb} from '@/lib/server/peer-profile-repository';

export async function GET(_request: Request, {params}: {params: Promise<{peerId: string}>}) {
  const {peerId} = await params;
  const profile = await getPeerProfileFromDb(peerId);

  if(!profile) {
    return NextResponse.json({error: 'Peer profile not found'}, {status: 404});
  }

  return NextResponse.json(profile);
}
