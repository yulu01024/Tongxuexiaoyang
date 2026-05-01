import React from 'react';
import { Activity, User } from '../types';
import { Shield, MapPin, Calendar, Clock, Mic2, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface SampleCardProps {
  activity: Activity;
  creator?: User;
  onAccept: (id: string) => void;
}

export const SampleCard: React.FC<SampleCardProps> = ({ activity, onAccept }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="premium-card p-6 mb-5 relative transition-shadow hover:shadow-lg"
      id={`activity-${activity.id}`}
    >
      {/* Category & Status */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex gap-2">
          <span className="px-2.5 py-1 bg-brand-primary/5 text-brand-primary text-[10px] font-bold rounded-lg border border-brand-primary/10 uppercase tracking-tight">
            {activity.type}
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-brand-accent/5 text-brand-accent text-[10px] font-bold rounded-lg border border-brand-accent/10">
            <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse"></span>
            寻找搭子
          </span>
        </div>
        {activity.voiceUrl && (
          <div className="text-brand-primary/40">
            <Mic2 size={16} strokeWidth={2.5} />
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="font-extrabold text-lg text-slate-900 mb-5 leading-snug tracking-tight">
        {activity.title}
      </h3>

      {/* Info Bento */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex items-center gap-2 group">
          <div className="w-8 h-8 flex items-center justify-center bg-brand-primary/5 rounded-lg text-brand-primary group-hover:scale-110 transition-transform">
            <Calendar size={14} />
          </div>
          <span className="text-xs font-semibold text-slate-600">{activity.time}</span>
        </div>
        <div className="flex items-center gap-2 group">
          <div className="w-8 h-8 flex items-center justify-center bg-brand-accent/5 rounded-lg text-brand-accent group-hover:scale-110 transition-transform">
            <MapPin size={14} />
          </div>
          <span className="text-xs font-semibold text-slate-600">{activity.location}</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="pt-5 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.creatorId}`} 
              className="w-10 h-10 rounded-xl bg-slate-50 transition-all cursor-pointer shadow-sm ring-2 ring-white" 
              alt="avatar"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div className="flex flex-col">
            <div className="text-[11px] font-bold text-slate-900 leading-tight">活跃校友</div>
            <div className="text-[9px] text-brand-primary font-black uppercase tracking-widest flex items-center gap-1">
              <Trophy size={10} /> 信任 98%
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => onAccept(activity.id)}
          className="premium-button px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest"
          id={`btn-accept-${activity.id}`}
        >
          领取小样
        </button>
      </div>
    </motion.div>
  );
};
