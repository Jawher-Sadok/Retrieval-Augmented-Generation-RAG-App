// src/components/ChatInterface.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, MoreVertical, MessageCircle, Zap, Sparkles, Bot } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import QuickReplies from './QuickReplies';
import { Message, generateResponse } from '../utils/chatUtils';
import axios from 'axios';

const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "🚀 Welcome to the future of customer support! I'm ARIA, your AI-powered assistant. How can I help you today?",
            sender: 'bot',
            timestamp: new Date(),
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [file, setFile] = useState<File | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = async () => {
        if (!inputText.trim() && !file) return;

        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            try {
                await axios.post('http://localhost:8000/upload/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setFile(null);
            } catch (error) {
                console.error('File upload failed:', error);
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    text: "Failed to process the uploaded file.",
                    sender: 'bot',
                    timestamp: new Date(),
                }]);
                return;
            }
        }

        if (inputText.trim()) {
            const userMessage: Message = {
                id: Date.now().toString(),
                text: inputText,
                sender: 'user',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, userMessage]);
            setInputText('');
            setIsTyping(true);

          const response = await generateResponse(inputText);
          setTimeout(() => {
              const botMessage: Message = {
                  id: (Date.now() + 1).toString(),
                  text: response.answer,
                  sender: 'bot',
                  timestamp: new Date(),
                  sources: response.sources,
              };
              setMessages(prev => [...prev, botMessage]);
              setIsTyping(false);
          }, 1000 + Math.random() * 2000);
                  }
    };

    const handleQuickReply = (text: string) => {
        setInputText(text);
        inputRef.current?.focus();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleFeedback = (messageId: string, type: 'positive' | 'negative') => {
        setMessages(prev => prev.map(msg =>
            msg.id === messageId ? { ...msg, feedback: type } : msg
        ));
    };

    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(true)}
                    className="relative bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white p-4 rounded-full shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-110 transition-all duration-300 animate-pulse-glow"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur opacity-75 animate-spin-slow"></div>
                    <div className="relative">
                        <MessageCircle size={24} />
                        <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-twinkle" />
                    </div>
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen max-w-4xl mx-auto relative z-10">
            {/* Header */}
            <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 p-4 flex items-center justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10"></div>
                <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-spin-slow">
                        <div className="absolute inset-1 bg-slate-900 rounded-full flex items-center justify-center">
                            <Bot className="text-cyan-400" size={20} />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full blur opacity-50"></div>
                    </div>
                    <div className="relative">
                        <h1 className="font-bold text-white text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            ARIA Support
                        </h1>
                        <p className="text-sm text-cyan-300 flex items-center">
                            <Zap size={12} className="mr-1 animate-pulse" />
                            Neural Network Active
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110">
                        <MoreVertical size={20} className="text-white/70 hover:text-white" />
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110 md:hidden text-white/70 hover:text-white"
                    >
                        ×
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 relative">
                {messages.map((message, index) => (
                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                            <MessageBubble
                                message={message}
                                onFeedback={handleFeedback}
                                isLatest={index === messages.length - 1}
                            />
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <TypingIndicator />
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <QuickReplies onQuickReply={handleQuickReply} />

            {/* Input */}
            <div className="bg-black/20 backdrop-blur-xl border-t border-white/10 p-4 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5"></div>
                <div className="flex items-center space-x-2">
                    <label className="p-3 text-cyan-400 hover:text-cyan-300 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110 relative group cursor-pointer">
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <Paperclip size={20} />
                        <div className="absolute inset-0 bg-cyan-400/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                    </label>
                    <div className="flex-1 relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me anything..."
                            className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 text-white placeholder-white/50 hover:bg-white/15"
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <Sparkles size={16} className="text-purple-400 animate-twinkle" />
                        </div>
                    </div>
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputText.trim() && !file}
                        className="relative p-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white rounded-full hover:shadow-2xl hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 transition-all duration-300 group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                        <div className="relative">
                            <Send size={18} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;