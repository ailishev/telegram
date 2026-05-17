import {NextResponse} from 'next/server';
import {getPeerProfileSectionFromDb} from '@/lib/server/peer-profile-repository';
import type {PeerProfileSection} from '@/types/peer-profile';

const sectionSet = new Set<PeerProfileSection>(['about', 'stories', 'gifts', 'music']);

export async function GET(_request: Request, {params}: {params: {peerId: string, section: string}}) {
  const {peerId, section} = params;

  if(!sectionSet.has(section as PeerProfileSection)) {
    return NextResponse.json({error: 'Unknown section'}, {status: 400});
  }

  const data = await getPeerProfileSectionFromDb(peerId, section as PeerProfileSection);
  if(!data) {
    return NextResponse.json({error: 'Peer profile not found'}, {status: 404});
  }

  return NextResponse.json({peerId, section, data});
}
