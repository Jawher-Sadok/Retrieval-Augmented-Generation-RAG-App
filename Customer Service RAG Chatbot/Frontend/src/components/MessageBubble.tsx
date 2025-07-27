import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Copy, Bot, User, Sparkles, Zap } from 'lucide-react';
import { Message } from '../utils/chatUtils';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: Message;
  onFeedback: (messageId: string, type: 'positive' | 'negative') => void;
  isLatest: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onFeedback, isLatest }) => {
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`animate-slide-in ${isLatest ? 'animate-matrix-appear' : ''} relative`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {message.sender === 'bot' && (
        <div className="flex items-center space-x-2 mb-2">
          <div className="relative w-8 h-8 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse-glow">
            <div className="absolute inset-0.5 bg-slate-900 rounded-full flex items-center justify-center">
              <Bot size={14} className="text-cyan-400" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full blur opacity-50"></div>
          </div>
          <span className="text-xs text-cyan-300 font-medium flex items-center">
            <Zap size={10} className="mr-1 animate-pulse" />
            ARIA Neural Network
          </span>
        </div>
      )}
      
      <div className={`relative group ${message.sender === 'user' ? 'ml-8' : 'mr-8'}`}>
        {/* Holographic effect for bot messages */}
        {message.sender === 'bot' && (
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        )}
        
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 ${
            message.sender === 'user'
              ? 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white ml-auto shadow-lg shadow-purple-500/25 relative overflow-hidden'
              : 'bg-black/40 backdrop-blur-xl border border-white/20 text-white shadow-lg shadow-cyan-500/10 relative overflow-hidden'
          }`}
        >
          {/* Matrix-like background pattern for bot messages */}
          {message.sender === 'bot' && (
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-500/20"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-circuit-pattern opacity-30"></div>
            </div>
          )}
          
          {/* Shimmer effect for user messages */}
          {message.sender === 'user' && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
          )}
          
          <ReactMarkdown>{message.text}</ReactMarkdown>
          
          {message.sources && (
            <div className="mt-3 pt-2 border-t border-white/20 relative z-10">
              <p className="text-xs text-cyan-300 mb-2 flex items-center">
                <Sparkles size={10} className="mr-1" />
                Knowledge Sources:
              </p>
              {message.sources.map((source, index) => (
                <span key={index} className="inline-block text-xs bg-white/10 text-cyan-200 px-2 py-1 rounded-full mr-2 mb-1 border border-cyan-400/30">
                  {source}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-white/50">{formatTime(message.timestamp)}</span>
          
          {message.sender === 'user' && (
            <div className="flex items-center space-x-1">
              <User size={12} className="text-white/50" />
            </div>
          )}
        </div>

        {/* Actions */}
        {message.sender === 'bot' && (showActions || message.feedback) && (
          <div className="flex items-center space-x-2 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button
              onClick={handleCopy}
              className="p-2 text-white/50 hover:text-cyan-400 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110 relative group/btn"
              title="Copy message"
            >
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full scale-0 group-hover/btn:scale-100 transition-transform duration-300"></div>
              <Copy size={14} className="relative z-10" />
            </button>
            
            <button
              onClick={() => onFeedback(message.id, 'positive')}
              className={`p-1 rounded transition-colors ${
                message.feedback === 'positive'
                  ? 'text-green-400 bg-green-400/20 scale-110'
                  : 'text-white/50 hover:text-green-400 hover:bg-green-400/20 hover:scale-110'
              }`}
              title="Helpful"
            >
              <ThumbsUp size={14} />
            </button>
            
            <button
              onClick={() => onFeedback(message.id, 'negative')}
              className={`p-1 rounded transition-colors ${
                message.feedback === 'negative'
                  ? 'text-red-400 bg-red-400/20 scale-110'
                  : 'text-white/50 hover:text-red-400 hover:bg-red-400/20 hover:scale-110'
              }`}
              title="Not helpful"
            >
              <ThumbsDown size={14} />
            </button>
          </div>
        )}
        
        {copied && (
          <div className="absolute -top-10 left-0 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full shadow-lg animate-bounce-in">
            Copied!
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;