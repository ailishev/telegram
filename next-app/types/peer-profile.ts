export type PeerProfileSection = 'about' | 'stories' | 'gifts' | 'music';

export type PeerProfileResponse = {
  peerId: string,
  kind: 'user' | 'chat' | 'channel',
  header: {
    title: string,
    subtitle: string,
    avatar: string | null
  },
  flags: {
    isForum: boolean,
    isTopic: boolean,
    hasSavedMusic: boolean
  },
  sections: {
    about: Record<string, string>,
    stories: Array<Record<string, string>>,
    gifts: Array<Record<string, string>>,
    music: Array<Record<string, string>>
  }
};
