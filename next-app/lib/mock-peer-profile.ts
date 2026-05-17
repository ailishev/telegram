import type {PeerProfileResponse} from '@/types/peer-profile';

export function getMockPeerProfile(peerId: string): PeerProfileResponse {
  return {
    peerId,
    kind: 'user',
    header: {
      title: 'Mock User',
      subtitle: '@mock_user',
      avatar: null
    },
    flags: {
      isForum: false,
      isTopic: false,
      hasSavedMusic: true
    },
    sections: {
      about: {
        bio: 'This is mocked projection data for migration phase start.'
      },
      stories: [{id: 'story-1', title: 'Welcome story'}],
      gifts: [{id: 'gift-1', title: 'Golden Star'}],
      music: [{id: 'track-1', title: 'Mock Anthem'}]
    }
  };
}
