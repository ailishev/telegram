import {NextResponse} from 'next/server';
import {getMockPeerProfile} from '@/lib/mock-peer-profile';
import {getPeerProfileFromDb} from '@/lib/server/peer-profile-repository';
import type {PeerProfileSection} from '@/types/peer-profile';

const sectionSet = new Set<PeerProfileSection>(['about', 'stories', 'gifts', 'music']);

export async function GET(_request: Request, {params}: {params: Promise<{peerId: string, section: string}>}) {
  const {peerId, section} = await params;

  if(!sectionSet.has(section as PeerProfileSection)) {
    return NextResponse.json({error: 'Unknown section'}, {status: 400});
  }

  const profile = await getPeerProfileFromDb(peerId) || getMockPeerProfile(peerId);
  return NextResponse.json({
    peerId,
    section,
    data: profile.sections[section as PeerProfileSection]
  });
}
