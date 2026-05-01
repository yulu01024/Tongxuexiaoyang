import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Activity, ChatRoom, Message } from './types';

interface AppContextType {
  currentUser: User;
  activities: Activity[];
  myActivities: Activity[];
  chatRooms: ChatRoom[];
  messages: Message[];
  addActivity: (activity: Activity) => void;
  acceptActivity: (activityId: string) => void;
  sendMessage: (chatId: string, content: string, type?: 'text' | 'image' | 'location') => void;
  evaluateChat: (chatId: string, choice: 'agree' | 'decline') => void;
}

const MOCK_USER: User = {
  id: 'u1',
  name: '学长小样',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  grade: '大三',
  bio: '羽毛球二级，爱运动的学长',
  creditScore: 98,
  badges: ['靠谱学长', '全勤选手'],
  preferences: ['运动', '学习']
};

const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    creatorId: 'u2',
    type: '运动',
    title: '明天下午南区羽毛球，新手养生局',
    time: '2026-04-23 15:00:00', // Changed to ISO for easier parsing for countdown
    location: '南区体育馆',
    level: '新手友好',
    requirements: '能接住高远球就行，别太较真',
    status: 'open',
    createdAt: Date.now() - 3600000
  },
  {
    id: 'a2',
    creatorId: 'u3',
    type: '学习',
    title: '图书馆三楼考研区，互相监督不闲聊',
    time: '2026-04-23 19:00:00',
    location: '校图书馆三楼',
    level: '专注模式',
    requirements: '能坚持每天来的，可以轮流占座',
    status: 'open',
    createdAt: Date.now() - 7200000
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const addActivity = (activity: Activity) => {
    setActivities([activity, ...activities]);
  };

  const acceptActivity = (activityId: string) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;

    const newChatId = `chat_${activityId}`;
    const newChat: ChatRoom = {
      id: newChatId,
      activityId,
      participants: [activity.creatorId, MOCK_USER.id],
      status: 'active',
      evaluations: {},
      expiryTime: Date.now() + 48 * 3600000 // Reduced to 48h to make countdown more visible
    };

    setActivities(activities.map(a => 
      a.id === activityId ? { ...a, status: 'matched' as const } : a
    ));
    setChatRooms([...chatRooms, newChat]);
    
    // 发送系统破冰消息
    const icebreaker: Message = {
      id: `msg_sys_${activityId}`,
      chatId: newChatId,
      senderId: 'system',
      content: `🎉 小样匹配成功！你们都对${activity.type}感兴趣，可以聊聊活动细节。`,
      timestamp: Date.now(),
      type: 'system'
    };
    setMessages([...messages, icebreaker]);
  };

  const sendMessage = (chatId: string, content: string, type: 'text' | 'image' | 'location' = 'text') => {
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      chatId,
      senderId: MOCK_USER.id,
      content,
      timestamp: Date.now(),
      type
    };
    setMessages([...messages, newMessage]);
  };

  const evaluateChat = (chatId: string, choice: 'agree' | 'decline') => {
    setChatRooms(chatRooms.map(chat => {
      if (chat.id === chatId) {
        const newEvals = { ...chat.evaluations, [MOCK_USER.id]: choice };
        // 模拟另一方评价 (逻辑演示)
        const otherUserId = chat.participants.find(p => p !== MOCK_USER.id)!;
        newEvals[otherUserId] = 'agree'; // 模拟对方也同意，以演示成功路径

        let newStatus = chat.status;
        if (newEvals[MOCK_USER.id] === 'agree' && newEvals[otherUserId] === 'agree') {
          newStatus = 'permanent';
        } else if (newEvals[MOCK_USER.id] === 'decline' || newEvals[otherUserId] === 'decline') {
          newStatus = 'closed';
        }

        return { ...chat, evaluations: newEvals, status: newStatus as any };
      }
      return chat;
    }));
  };

  return (
    <AppContext.Provider value={{ 
      currentUser: MOCK_USER, 
      activities, 
      myActivities: activities.filter(a => a.creatorId === MOCK_USER.id),
      chatRooms, 
      messages,
      addActivity,
      acceptActivity,
      sendMessage,
      evaluateChat
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
