import React, { useState } from 'react';
import { HeartIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { Button, Input, Card } from '../../../ui';
import { useAsyncState } from '../../../../shared/hooks';
import { apiService } from '../../../../shared/services/api';
import type { Message, HealthQuery, ApiResponse } from '../../../../shared/types';
import { generateId, categorizeHealthQuery } from '../../../../shared/utils';

interface MedicalChatProps {
  onMessageSent?: (message: Message) => void;
  className?: string;
}

const MedicalChat: React.FC<MedicalChatProps> = ({
  onMessageSent,
  className = '',
}) => {
  const [inputText, setInputText] = useState('');
  const { loading, execute } = useAsyncState<ApiResponse<any>>();

  const handleSendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage: Message = {
      id: generateId(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'medical',
    };

    // Call onMessageSent if provided
    onMessageSent?.(userMessage);

    try {
      const query: HealthQuery = {
        question: inputText.trim(),
        include_cbt: false,
        include_shifa: false,
      };

      const response = await execute(() => apiService.askHealthQuestion(query));

      if (response && response.success && response.data?.medical_response) {
        const aiMessage: Message = {
          id: generateId(),
          text: response.data.medical_response.content || response.data.medical_response,
          sender: 'ai',
          timestamp: new Date(),
          type: 'medical',
          data: response.data.medical_response,
          metadata: {
            confidence_score: response.data.medical_response.confidence_score,
            sources: response.data.medical_response.sources,
            category: categorizeHealthQuery(inputText),
          },
        };

        onMessageSent?.(aiMessage);
      }
    } catch (error) {
      console.error('Error sending medical query:', error);
      
      const errorMessage: Message = {
        id: generateId(),
        text: 'I apologize, but I encountered an error processing your medical question. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'medical',
      };

      onMessageSent?.(errorMessage);
    } finally {
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className={`${className}`} padding="lg">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
          <HeartIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Medical Assistant</h3>
          <p className="text-sm text-gray-500">Ask me about your health concerns</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a medical question..."
            fullWidth
            disabled={loading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || loading}
            isLoading={loading}
            leftIcon={<PaperAirplaneIcon className="w-4 h-4" />}
          >
            Send
          </Button>
        </div>

        <div className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <strong>Medical Disclaimer:</strong> This AI provides general health information only and should not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.
        </div>
      </div>
    </Card>
  );
};

export default MedicalChat; 