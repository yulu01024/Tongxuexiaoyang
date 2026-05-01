import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../AppContext';
import { ArrowLeft, Send, MapPin, Calendar, Info, ShieldCheck, Heart, UserMinus, Sparkles, Image as ImageIcon, Map, Clock, Mic2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ChatRoomPage: React.FC<{ chatId: string; onBack: () => void }> = ({ chatId, onBack }) => {
  const { messages, sendMessage, chatRooms, activities, currentUser, evaluateChat } = useApp();
  const [inputText, setInputText] = useState('');
  const chatRoom = chatRooms.find(c => c.id === chatId);
  const activity = activities.find(a => a.id === chatRoom?.activityId);
  const chatMessages = messages.filter(m => m.chatId === chatId);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState<{expiry: string, start: string}>({ expiry: '', start: '' });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (!chatRoom || !activity) return;

    const timer = setInterval(() => {
      const now = Date.now();
      
      // Expiry countdown
      const diffExpiry = Math.max(0, chatRoom.expiryTime - now);
      const hExpiry = Math.floor(diffExpiry / 3600000);
      const mExpiry = Math.floor((diffExpiry % 3600000) / 60000);
      const sExpiry = Math.floor((diffExpiry % 60000) / 1000);

      // Start countdown (assuming activity.time is parsable)
      let startString = '已开始';
      try {
        const startTime = new Date(activity.time).getTime();
        const diffStart = startTime - now;
        if (diffStart > 0) {
           const hStart = Math.floor(diffStart / 3600000);
           const mStart = Math.floor((diffStart % 3600000) / 60000);
           startString = `${hStart}h ${mStart}m 后开始`;
        }
      } catch(e) {
        startString = activity.time; // Fallback
      }

      setTimeLeft({
        expiry: `${hExpiry.toString().padStart(2, '0')}:${mExpiry.toString().padStart(2, '0')}:${sExpiry.toString().padStart(2, '0')}`,
        start: startString
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [chatRoom, activity]);

  if (!chatRoom || !activity) return null;

  const handleSend = (type: 'text' | 'image' | 'location' = 'text') => {
    if (type === 'text') {
      if (!inputText.trim()) return;
      sendMessage(chatId, inputText, 'text');
      setInputText('');
    } else if (type === 'image') {
      sendMessage(chatId, 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400', 'image');
    } else if (type === 'location') {
      sendMessage(chatId, '软件园南区体育中心 · 5号馆', 'location');
    }
  };

  const isPermanent = chatRoom.status === 'permanent';
  const isClosed = chatRoom.status === 'closed';

  return (
    <div className="fixed inset-0 bg-campus-bg z-50 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-600 transition-colors active:bg-slate-50">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="font-bold text-slate-900 text-sm italic">
              {isPermanent ? "永久搭子频道" : "灵感试用空间"}
            </h2>
            <div className="flex items-center gap-1.5 text-[10px] text-brand-primary font-bold uppercase tracking-widest mt-0.5">
              <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse"></span>
              {timeLeft.expiry} 后自动封存
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        {/* Activity Contract Card */}
        <div className="premium-card p-5 border-l-4 border-l-brand-primary bg-brand-primary/[0.03] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-brand-primary" />
                <span className="font-bold text-brand-primary text-[10px] uppercase tracking-wider">数字契约验证</span>
            </div>
            <div className="flex items-center gap-1 bg-white/80 px-2 py-1 rounded-lg border border-brand-primary/10 text-[9px] font-bold text-brand-primary/60">
                <Clock size={10} className="text-brand-primary" /> {timeLeft.start}
            </div>
          </div>
          <p className="text-slate-900 font-extrabold text-base mb-4 leading-tight">{activity.title}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/80 p-2.5 rounded-xl text-[10px] font-bold text-slate-500 flex items-center gap-2 border border-slate-50">
              <Calendar size={12} className="text-brand-primary" /> {activity.time}
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl text-[10px] font-bold text-slate-500 flex items-center gap-2 border border-slate-50">
              <MapPin size={12} className="text-brand-accent" /> {activity.location}
            </div>
          </div>
        </div>

        {chatMessages.map(msg => (
          <div key={msg.id} className={`flex ${msg.senderId === 'system' ? 'justify-center' : msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
            {msg.senderId === 'system' ? (
               <div className="bg-brand-primary/5 text-brand-primary/60 text-[9px] py-1.5 px-5 rounded-full flex items-center gap-2 font-bold uppercase tracking-widest border border-brand-primary/10">
                  <Sparkles size={10} /> {msg.content}
               </div>
            ) : (
                <div className={`max-w-[85%] rounded-2xl overflow-hidden shadow-sm ${
                    msg.senderId === currentUser.id 
                    ? 'bg-brand-primary text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                }`}>
                    {msg.type === 'text' && <div className="p-3 px-4 text-[13px] font-medium leading-relaxed">{msg.content}</div>}
                    {msg.type === 'image' && (
                        <div className="relative group">
                            <img src={msg.content} alt="sent" className="w-full aspect-square object-cover" />
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-md p-1 rounded-lg text-white/80 border border-white/20"><ImageIcon size={14} /></div>
                        </div>
                    )}
                    {msg.type === 'location' && (
                        <div className="p-3 space-y-2">
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className={msg.senderId === currentUser.id ? 'text-white/60' : 'text-brand-primary'} />
                                <span className={`text-[12px] font-bold underline decoration-dotted underline-offset-4 ${msg.senderId === currentUser.id ? 'text-white' : 'text-slate-800'}`}>位置实时共享</span>
                            </div>
                            <div className={`text-[11px] font-medium ${msg.senderId === currentUser.id ? 'text-white/80' : 'text-slate-500'}`}>{msg.content}</div>
                            <div className={`h-24 rounded-xl overflow-hidden relative border ${msg.senderId === currentUser.id ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-primary/20"><Map size={24} /></div>
                            </div>
                        </div>
                    )}
                </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer / Evaluation */}
      <div className="p-6 pb-10 bg-white/90 backdrop-blur-xl border-t border-slate-100">
        {chatRoom.status === 'active' ? (
          <div className="space-y-5">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {[
                  { icon: <ImageIcon size={14} />, label: '传图', type: 'image' },
                  { icon: <Map size={14} />, label: '定位', type: 'location' },
                  { icon: <Mic2 size={14} />, label: '语音', type: null }
                ].map((btn, i) => (
                  <button 
                    key={i}
                    onClick={() => btn.type && handleSend(btn.type as any)}
                    className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 text-slate-500 text-[10px] font-bold tracking-widest hover:border-brand-primary/30 transition-colors active:scale-95 whitespace-nowrap"
                  >
                    {btn.icon} {btn.label}
                  </button>
                ))}
            </div>
            <div className="flex gap-3 items-center">
                <input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend('text')}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-50 p-4 rounded-xl text-sm outline-none focus:ring-1 focus:ring-slate-400 border border-slate-200 font-medium placeholder:text-slate-300"
                />
                <button 
                    onClick={() => handleSend('text')}
                    className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg transition-transform active:scale-90"
                >
                    <Send size={18} />
                </button>
            </div>
          </div>
        ) : chatRoom.status === 'permanent' ? (
           <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-100">
                <CheckCircle2 size={24} />
              </div>
              <p className="text-slate-900 text-sm font-bold mb-5 tracking-tight">契约生效，已转为永久联系记录</p>
              <button className="premium-button w-full py-4 rounded-xl text-sm tracking-widest uppercase">添加对方微信 / QQ</button>
           </div>
        ) : (
           <div className="text-center py-8">
              <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-100">
                <ShieldCheck size={24} />
              </div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] leading-loose">本次试用已结束<br/>数据将在 72 小时后由 AI 彻底擦除</p>
           </div>
        )}

        {/* Floating Evaluation Trigger */}
        {!isPermanent && !isClosed && (
            <div className="mt-8 pt-6 border-t border-slate-100 flex gap-4">
                <button 
                    onClick={() => evaluateChat(chatId, 'agree')}
                    className="flex-1 premium-button py-4 rounded-xl flex items-center justify-center gap-2 text-[11px] tracking-[0.15em] uppercase"
                >
                    <Heart size={16} /> 确认合拍
                </button>
                <button 
                    onClick={() => evaluateChat(chatId, 'decline')}
                    className="flex-1 bg-white text-slate-400 py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-[11px] border border-slate-200 tracking-[0.15em] uppercase hover:bg-slate-50 transition-colors"
                >
                    到此为止
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
