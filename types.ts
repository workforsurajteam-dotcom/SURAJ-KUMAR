
export enum ContentPillar {
  LEARN = 'LEARN',
  THINK = 'THINK',
  FEEL = 'FEEL',
  SMILE = 'SMILE'
}

export interface Post {
  id: string;
  pillar: ContentPillar;
  title: string;
  author: string;
  authorYear: string;
  content: string;
  imageUrl?: string;
  isMCQ?: boolean;
  options?: string[];
  correctOption?: number;
  explanation?: string;
  timestamp: string;
  savedCount: number;
}

export interface UserProfile {
  id: string;
  email: string;
  password?: string;
  name: string;
  year: string;
  college: string;
  interest: string;
  savedPosts: string[];
  joinedRooms: string[];
  totalLearningMinutes: number;
  totalScrollingMinutes: number;
}

export interface CommunityRoom {
  id: string;
  name: string;
  description: string;
  activeUsers: number;
  icon: string;
}
