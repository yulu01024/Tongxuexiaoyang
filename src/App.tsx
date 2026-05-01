/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './AppContext';
import { SampleCard } from './components/SampleCard';
import { PostPage } from './components/PostPage';
import { ChatRoomPage } from './components/ChatRoomPage';
import { 
  Users, 
  MessageCircle, 
  Plus, 
  User as UserIcon, 
  Search, 
  Bell,
  CheckCircle2,
  Trophy,
  Sparkles,
  Heart,
  Clock,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function MainApp() {
  const { activities, acceptActivity, chatRooms, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'square' | 'chat' | 'buddies' | 'profile'>('square');
  const [category, setCategory] = useState<string>('推荐');
  const [showPost, setShowPost] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const filteredActivities = category === '推荐' 
    ? activities.filter(a => a.status === 'open')
    : activities.filter(a => a.type === category && a.status === 'open');

  return (
    <div className="max-w-md mx-auto min-h-screen relative pb-24 overflow-x-hidden">
      {/* Header */}
      <div className="p-6 pt-10 pb-4 flex items-center justify-between sticky top-0 z-30 bg-campus-bg/90 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary rounded-2xl shadow-[0_4px_12px_rgba(139,92,246,0.3)] flex items-center justify-center text-white">
            <Sparkles size={20} fill="currentColor" fillOpacity={0.2} />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            同学小样
          </h1>
        </div>
        <button className="w-10 h-10 bg-white border border-brand-primary/10 rounded-xl flex items-center justify-center shadow-sm text-brand-primary transition-all hover:bg-brand-primary hover:text-white">
          <Bell size={18} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'square' && (
          <motion.div 
            key="square"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 pt-2"
          >
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-primary/60" size={16} />
              <input 
                placeholder="搜索感兴趣的小样活动..." 
                className="w-full bg-white h-12 pl-12 pr-4 rounded-2xl shadow-sm border border-brand-primary/5 focus:border-brand-primary/30 outline-none text-[13px] font-medium transition-all"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar -mx-6 px-6">
              {['✨ 推荐', '⚽ 运动', '📚 学习', '🚗 出行', '🍕 干饭', '🧩 其他'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setCategory(cat.split(' ')[1] || cat)}
                  className={`px-5 py-2.5 rounded-xl whitespace-nowrap font-bold text-xs transition-all border ${
                    category === (cat.split(' ')[1] || cat)
                    ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20 scale-105' 
                    : 'bg-white text-slate-500 border-slate-100 hover:border-brand-primary/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="mt-2 space-y-4">
              {filteredActivities.length > 0 ? (
                filteredActivities.map(activity => (
                  <SampleCard 
                    key={activity.id} 
                    activity={activity} 
                    onAccept={(id) => {
                      acceptActivity(id);
                      setActiveTab('chat');
                    }}
                  />
                ))
              ) : (
                <div className="py-20 text-center text-slate-300 font-bold">
                   这里空空如也，快去发发吧～
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'chat' && (
          <motion.div 
            key="chat"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6"
          >
            <h2 className="text-xl font-black mb-6 text-slate-800">试用聊天室</h2>
            <div className="space-y-4">
              {chatRooms.filter(c => c.status !== 'permanent').length > 0 ? (
                chatRooms.filter(c => c.status !== 'permanent').map(chat => {
                  const activity = activities.find(a => a.id === chat.activityId);
                  return (
                    <button 
                      key={chat.id}
                      onClick={() => setActiveChatId(chat.id)}
                      className="w-full flex items-center gap-4 premium-card p-4 hover:border-indigo-200 transition-colors group"
                    >
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.id}`} 
                        className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100"
                        alt="avatar"
                      />
                      <div className="flex-1 text-left">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-sm text-slate-900 group-hover:text-brand-primary transition-colors">{activity?.title || '活动讨论'}</span>
                          <span className="text-[10px] text-slate-300 font-medium tracking-tighter">12:30</span>
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 font-medium italic">
                          “明天南区集合，不见不散”
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="py-20 text-center space-y-4">
                   <div className="bg-white/50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto text-brand-primary/30 border border-white">
                      <MessageCircle size={32} />
                   </div>
                   <p className="text-slate-400 text-sm font-bold">还没有匹配成功的试用搭子</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'buddies' && (
          <motion.div 
            key="buddies"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-800">我的搭子</h2>
              <div className="bg-brand-primary/10 px-3 py-1 rounded-full text-brand-primary text-[10px] font-black uppercase">
                 已结对: {chatRooms.filter(c => c.status === 'permanent').length}
              </div>
            </div>
            
            <div className="space-y-4">
              {chatRooms.filter(c => c.status === 'permanent').length > 0 ? (
                chatRooms.filter(c => c.status === 'permanent').map(chat => {
                  return (
                    <div key={chat.id} className="premium-card p-4 flex items-center justify-between border-l-4 border-l-brand-primary">
                      <div className="flex items-center gap-4">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.id}`} 
                          className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 shadow-sm"
                          alt="buddy"
                        />
                        <div>
                          <div className="text-sm font-bold text-slate-900">核心搭子</div>
                          <div className="text-[10px] text-brand-primary font-bold flex items-center gap-1 uppercase tracking-tighter">
                             <CheckCircle2 size={10} /> 长期连接已建立
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveChatId(chat.id)}
                        className="w-9 h-9 bg-slate-50 flex items-center justify-center text-slate-600 rounded-lg border border-slate-200 transition-colors hover:bg-slate-100"
                      >
                        <MessageCircle size={16} />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="py-20 text-center space-y-4">
                   <div className="bg-white/50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto text-brand-accent/30 border border-white">
                      <Heart size={32} />
                   </div>
                   <p className="text-slate-400 text-sm font-bold leading-relaxed px-10">
                      通过“试用小样”后互选“期待再聚”，<br/>就能在这里看到你的永久搭子啦！
                   </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div 
            key="profile"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6"
          >
            <div className="flex flex-col items-center py-8">
              <div className="relative">
                <img 
                  src={currentUser.avatar}
                  className="w-24 h-24 rounded-[32px] border-4 border-white shadow-xl mb-4 bg-white"
                  alt="me"
                />
                <div className="absolute -bottom-1 -right-1 bg-brand-accent text-white p-2 rounded-2xl border-4 border-white shadow-sm">
                  <CheckCircle2 size={16} />
                </div>
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{currentUser.name}</h2>
              <p className="text-slate-400 text-sm font-bold mt-1 uppercase tracking-widest">{currentUser.grade} · {currentUser.bio}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="premium-card p-6 text-center border-b-4 border-brand-primary shadow-lg shadow-brand-primary/5 bg-brand-primary/[0.03]">
                <div className="text-3xl font-black text-brand-primary mb-1">{currentUser.creditScore}</div>
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] flex items-center justify-center gap-1">
                   <Trophy size={14} className="text-brand-primary" /> 信用评级
                </div>
              </div>
              <div className="premium-card p-6 text-center border-b-4 border-brand-accent shadow-lg shadow-brand-accent/5 bg-brand-accent/[0.03]">
                <div className="text-3xl font-black text-brand-accent mb-1">{chatRooms.filter(c => c.status === 'permanent').length}</div>
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] flex items-center justify-center gap-1">
                   数字化契约
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { label: '历史搭子记录', icon: <Clock size={16} /> },
                { label: '兴趣偏好设置', icon: <Sparkles size={16} /> },
                { label: '信用档案申诉', icon: <ShieldCheck size={16} /> }
              ].map((item, idx) => (
                <button key={idx} className="w-full text-left p-4 premium-card flex justify-between items-center text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-300">{item.icon}</span>
                    {item.label}
                  </div>
                  <ArrowLeft className="rotate-180 text-slate-400" size={14} />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav Bar */}
      <div className="fixed bottom-6 left-6 right-6 glass-nav py-3 px-6 flex justify-between items-center z-50 rounded-2xl">
        {/* Left Side Tabs */}
        <div className="flex gap-10">
          <button 
            onClick={() => setActiveTab('square')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'square' ? 'text-brand-primary scale-110' : 'text-slate-400 opacity-60'}`}
          >
            <Users size={22} strokeWidth={activeTab === 'square' ? 3 : 2} />
            <span className="text-[10px] font-black tracking-widest">广场</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'chat' ? 'text-brand-primary scale-110' : 'text-slate-400 opacity-60'}`}
          >
            <div className="relative">
              <MessageCircle size={22} strokeWidth={activeTab === 'chat' ? 3 : 2} />
              {chatRooms.length > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-accent rounded-full ring-2 ring-white animate-pulse"></span>}
            </div>
            <span className="text-[10px] font-black tracking-widest">聊天</span>
          </button>
        </div>

        {/* Central Post Button */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-6">
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowPost(true)}
            className="w-16 h-16 bg-gradient-to-tr from-brand-primary to-brand-secondary text-white rounded-3xl flex items-center justify-center shadow-[0_8px_20px_rgba(139,92,246,0.4)] ring-8 ring-campus-bg"
          >
            <Plus size={32} strokeWidth={3} />
          </motion.button>
        </div>

        {/* Right Side Tabs */}
        <div className="flex gap-10">
          <button 
            onClick={() => setActiveTab('buddies')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'buddies' ? 'text-brand-primary scale-110' : 'text-slate-400 opacity-60'}`}
          >
            <Heart size={22} strokeWidth={activeTab === 'buddies' ? 3 : 2} />
            <span className="text-[10px] font-black tracking-widest">搭子</span>
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'profile' ? 'text-brand-primary scale-110' : 'text-slate-400 opacity-60'}`}
          >
            <UserIcon size={22} strokeWidth={activeTab === 'profile' ? 3 : 2} />
            <span className="text-[10px] font-black tracking-widest">我的</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showPost && (
          <PostPage onBack={() => setShowPost(false)} />
        )}
        {activeChatId && (
          <ChatRoomPage chatId={activeChatId} onBack={() => setActiveChatId(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
