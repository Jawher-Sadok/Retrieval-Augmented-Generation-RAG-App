import React from 'react';
import { MessageSquare, HelpCircle, Settings, FileText, Zap, Shield, CreditCard, Users } from 'lucide-react';

interface QuickRepliesProps {
  onQuickReply: (text: string) => void;
}

const QuickReplies: React.FC<QuickRepliesProps> = ({ onQuickReply }) => {
  const quickReplies = [
    { icon: Shield, text: "How do I reset my password?", color: "from-cyan-400 to-cyan-600", glow: "cyan" },
    { icon: Settings, text: "Account settings help", color: "from-purple-400 to-purple-600", glow: "purple" },
    { icon: CreditCard, text: "Billing questions", color: "from-pink-400 to-pink-600", glow: "pink" },
    { icon: Users, text: "Contact support", color: "from-orange-400 to-orange-600", glow: "orange" },
  ];

  return (
    <div className="px-4 py-3 bg-black/20 backdrop-blur-xl border-t border-white/10 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5"></div>
      <p className="text-xs text-cyan-300 mb-3 flex items-center relative z-10">
        <Zap size={10} className="mr-1 animate-pulse" />
        Quick Neural Queries:
      </p>
      <div className="flex flex-wrap gap-2">
        {quickReplies.map((reply, index) => (
          <button
            key={index}
            onClick={() => onQuickReply(reply.text)}
            className="group relative flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white hover:bg-white/20 hover:shadow-lg transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            {/* Holographic background effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${reply.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
            <div className={`absolute inset-0 bg-gradient-to-r ${reply.color} blur opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
            
            <div className={`relative w-5 h-5 bg-gradient-to-r ${reply.color} rounded-full flex items-center justify-center shadow-lg`}>
              <reply.icon size={10} className="text-white" />
              <div className={`absolute inset-0 bg-gradient-to-r ${reply.color} rounded-full blur opacity-50`}></div>
            </div>
            <span className="relative z-10 group-hover:text-white transition-colors font-medium">{reply.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickReplies;