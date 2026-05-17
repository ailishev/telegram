import {NextResponse} from 'next/server';
import {getMockPeerProfile} from '@/lib/mock-peer-profile';

export async function GET(_request: Request, {params}: {params: Promise<{peerId: string}>}) {
  const {peerId} = await params;
  return NextResponse.json(getMockPeerProfile(peerId));
}
