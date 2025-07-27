import React from 'react';
import { Bot, Zap, Brain } from 'lucide-react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="animate-slide-in relative">
      <div className="flex items-center space-x-2 mb-2">
        <div className="relative w-8 h-8 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse-glow">
          <div className="absolute inset-0.5 bg-slate-900 rounded-full flex items-center justify-center">
            <Bot size={14} className="text-cyan-400 animate-pulse" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full blur opacity-50"></div>
        </div>
        <span className="text-xs text-cyan-300 font-medium flex items-center">
          <Brain size={10} className="mr-1 animate-pulse" />
          ARIA is processing neural patterns...
        </span>
      </div>
      
      <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 shadow-lg shadow-cyan-500/10 mr-8 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
        <div className="absolute inset-0 bg-circuit-pattern opacity-20"></div>
        
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce shadow-lg shadow-cyan-400/50" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce shadow-lg shadow-purple-400/50" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce shadow-lg shadow-pink-400/50" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-sm text-white/70 ml-3 relative z-10 flex items-center">
            <Zap size={12} className="mr-1 animate-pulse text-cyan-400" />
            Accessing quantum knowledge matrix...
          </span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;