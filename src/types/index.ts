export type ComedyCategory = 'All' | 'Standup' | 'Desi Skits' | 'Memes' | 'Relatable' | 'Bloopers' | 'Office Humor';

export interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isVerified: boolean;
  followersCount: number;
  badge?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  clapsCount: number;
  isLiked?: boolean;
}

export interface VideoItem {
  id: string;
  videoUrl: string;
  posterUrl?: string;
  title: string;
  caption: string;
  tags: string[];
  category: ComedyCategory;
  creator: Creator;
  audioTitle: string;
  audioAuthor: string;
  durationSeconds: number;
  clapsCount: number;
  commentsCount: number;
  whatsappSharesCount: number;
  viewsCount: number;
  createdAt: string;
  isLiked?: boolean;
  isSaved?: boolean;
  isFollowing?: boolean;
  soundEffectUsed?: string;
  aspectRatio?: '9:16' | '1:1' | '4:5';
}

export interface SoundEffectItem {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
}

export interface TextOverlayItem {
  id: string;
  text: string;
  font: 'impact' | 'comic' | 'bollywood' | 'clean';
  color: string;
  bgColor?: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  scale: number;
}

export interface StickerOverlayItem {
  id: string;
  content: string; // emoji or text badge
  x: number;
  y: number;
  scale: number;
}
