import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, CpuChipIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { MedicalChat } from '../features/medical';
import { useChatHistory, useUserPreferences } from '../shared/hooks';
import { formatTime } from '../shared/utils';
import type { Message } from '../shared/types';

const ChatPage: React.FC = () => {
  const { messages, addMessage } = useChatHistory();
  const { preferences, updatePreferences } = useUserPreferences();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMessageSent = (message: Message) => {
    addMessage(message);
  };

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'cbt':
        return <CpuChipIcon className="w-4 h-4 text-blue-600" />;
      case 'shifa':
        return <SparklesIcon className="w-4 h-4 text-yellow-600" />;
      default:
        return <HeartIcon className="w-4 h-4 text-green-600" />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <HeartIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">ShifaAI Chat</h1>
              <p className="text-sm text-gray-500">Your AI Health Companion</p>
            </div>
          </div>
          
          {/* Feature toggles */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.include_cbt_by_default}
                onChange={(e) => updatePreferences({ include_cbt_by_default: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">CBT</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.include_shifa_by_default}
                onChange={(e) => updatePreferences({ include_shifa_by_default: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Shifa</span>
            </label>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {message.sender === 'ai' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    {getMessageIcon(message.type)}
                  </div>
                )}
                <div className={`chat-bubble ${message.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
                  <div className="whitespace-pre-wrap">{message.text}</div>
                  {message.data?.arabic && (
                    <div className="mt-2 p-2 bg-white/20 rounded arabic-text text-center">
                      {message.data.arabic}
                    </div>
                  )}
                  {message.data?.transliteration && (
                    <div className="mt-1 text-xs opacity-75 italic">
                      {message.data.transliteration}
                    </div>
                  )}
                  <div className="mt-1 text-xs opacity-60">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <MedicalChat onMessageSent={handleMessageSent} />
      </div>
    </div>
  );
};

export default ChatPage; 