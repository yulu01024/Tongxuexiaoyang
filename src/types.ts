/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  bio: string;
  creditScore: number;
  badges: string[];
  preferences: string[];
}

export interface Activity {
  id: string;
  creatorId: string;
  type: '运动' | '学习' | '出行' | '干饭' | '其他';
  title: string;
  time: string;
  location: string;
  level: string;
  requirements: string;
  voiceUrl?: string;
  voiceDuration?: number;
  status: 'open' | 'matched' | 'ongoing' | 'completed' | 'canceled';
  createdAt: number;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: number;
  type: 'text' | 'image' | 'location' | 'system';
}

export interface ChatRoom {
  id: string;
  activityId: string;
  participants: string[]; // [creatorId, joinerId]
  status: 'active' | 'evaluating' | 'permanent' | 'closed';
  evaluations: Record<string, 'agree' | 'decline' | null>; // userId -> choice
  expiryTime: number;
}
