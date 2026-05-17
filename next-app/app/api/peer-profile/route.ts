import {NextResponse} from 'next/server';
import {listPeerProfilesFromDb} from '@/lib/server/peer-profile-repository';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limitParam = Number(url.searchParams.get('limit') || '20');
  const cursor = url.searchParams.get('cursor') || undefined;

  const result = await listPeerProfilesFromDb(limitParam, cursor);
  return NextResponse.json(result);
}
