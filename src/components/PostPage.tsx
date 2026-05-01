import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { parseActivityInput } from '../services/geminiService';
import { Mic2, Send, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PostPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addActivity, currentUser } = useApp();
  const [input, setInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);

  const handleParse = async () => {
    if (!input.trim()) return;
    setIsParsing(true);
    const result = await parseActivityInput(input);
    setIsParsing(false);
    if (result) {
      setParsedData(result);
    }
  };

  const handleConfirm = () => {
    if (!parsedData) return;
    addActivity({
      id: `a_${Date.now()}`,
      creatorId: currentUser.id,
      ...parsedData,
      status: 'open',
      createdAt: Date.now()
    });
    onBack();
  };

  return (
    <div className="fixed inset-0 bg-campus-bg z-50 p-6 flex flex-col pt-12 overflow-y-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-600">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">发起新动向</h1>
      </div>

      <div className="relative mb-8">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="描述你的灵感或计划，AI 将自动解析..."
          className="w-full h-48 premium-card p-6 outline-none text-slate-800 leading-relaxed resize-none transition-all placeholder:text-slate-300 font-medium text-sm focus:ring-1 focus:ring-brand-primary/20"
        />
        <div className="absolute bottom-6 right-6 flex gap-3">
          <button className="w-12 h-12 bg-white text-slate-400 rounded-xl border border-slate-100 flex items-center justify-center shadow-lg hover:text-brand-primary active:scale-90">
            <Mic2 size={20} />
          </button>
          <button 
            onClick={handleParse}
            disabled={!input || isParsing}
            className="w-12 h-12 bg-brand-primary text-white rounded-xl flex items-center justify-center shadow-[0_8px_20px_rgba(139,92,246,0.3)] disabled:opacity-30 active:scale-90"
          >
            {isParsing ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {parsedData && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="premium-card p-6 space-y-6 border-brand-primary/20 bg-brand-primary/[0.02]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-primary text-white rounded-lg flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <span className="font-bold text-sm text-slate-900">AI 结构化解析完成</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-xl border border-brand-primary/5 shadow-sm">
                <span className="text-[9px] font-black text-brand-primary uppercase tracking-[0.1em] block mb-1">主分类</span>
                <span className="font-bold text-slate-700 text-[13px]">{parsedData.type}</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-brand-accent/5 shadow-sm">
                <span className="text-[9px] font-black text-brand-accent uppercase tracking-[0.1em] block mb-1">预设坐标</span>
                <span className="font-bold text-slate-700 text-[13px]">{parsedData.location}</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-50 shadow-sm col-span-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] block mb-1">预期时段</span>
                <span className="font-bold text-slate-700 text-[13px]">{parsedData.time}</span>
              </div>
            </div>

            <div className="pt-4 space-y-3">
               <button 
                onClick={handleConfirm}
                className="premium-button w-full py-4 rounded-xl text-sm font-bold tracking-widest uppercase"
              >
                确认并发布至广场
              </button>
              <button 
                onClick={() => setParsedData(null)}
                className="w-full text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] active:scale-95 transition-all"
              >
                撤回并重写
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
