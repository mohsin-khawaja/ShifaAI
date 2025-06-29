import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperAirplaneIcon, HeartIcon, CpuChipIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { apiService, HealthQuery } from '../services/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'medical' | 'cbt' | 'shifa';
  data?: any;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [includeCBT, setIncludeCBT] = useState(false);
  const [includeShifa, setIncludeShifa] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, sender: 'user' | 'ai', type?: 'medical' | 'cbt' | 'shifa', data?: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      type,
      data,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText('');
    setIsLoading(true);

    // Add user message
    addMessage(userMessage, 'user');

    try {
      const query: HealthQuery = {
        question: userMessage,
        include_cbt: includeCBT,
        include_shifa: includeShifa,
      };

      const response = await apiService.askHealthQuestion(query);

      if (response.success && response.data) {
        const { medical_response, cbt_recommendation, shifa_guidance } = response.data;

        // Add medical response
        if (medical_response) {
          addMessage(medical_response.content || medical_response, 'ai', 'medical', medical_response);
        }

        // Add CBT recommendation if requested
        if (includeCBT && cbt_recommendation) {
          const cbtText = `🧠 **CBT Exercise**: ${cbt_recommendation.name}\n\n${cbt_recommendation.description}\n\n**Steps:**\n${cbt_recommendation.steps?.map((step: string, i: number) => `${i + 1}. ${step}`).join('\n')}`;
          addMessage(cbtText, 'ai', 'cbt', cbt_recommendation);
        }

        // Add Shifa guidance if requested
        if (includeShifa && shifa_guidance) {
          const shifaText = `🌟 **Shifa Guidance**: ${shifa_guidance.dua?.arabic || shifa_guidance.remedy?.description || shifa_guidance.guidance}`;
          addMessage(shifaText, 'ai', 'shifa', shifa_guidance);
        }
      } else {
        addMessage('I apologize, but I encountered an error processing your request. Please try again.', 'ai');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('I apologize, but I\'m having trouble connecting to the server. Please check your connection and try again.', 'ai');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
              <h1 className="text-xl font-semibold text-gray-900">ShifaAI</h1>
              <p className="text-sm text-gray-500">Your AI Health Companion</p>
            </div>
          </div>
          
          {/* Feature toggles */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeCBT}
                onChange={(e) => setIncludeCBT(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">CBT</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeShifa}
                onChange={(e) => setIncludeShifa(e.target.checked)}
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
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <HeartIcon className="w-4 h-4 text-white" />
              </div>
              <div className="chat-bubble chat-bubble-ai">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about your health concerns..."
              className="input-field resize-none"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 