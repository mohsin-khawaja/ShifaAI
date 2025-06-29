import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  CpuChipIcon, 
  SparklesIcon, 
  MagnifyingGlassIcon,
  BookOpenIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { apiService } from '../services/api';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('cbt');
  const [cbtExercise, setCbtExercise] = useState<any>(null);
  const [shifaGuidance, setShifaGuidance] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: 'cbt', name: 'CBT Exercises', icon: CpuChipIcon },
    { id: 'shifa', name: 'Shifa Guidance', icon: SparklesIcon },
    { id: 'knowledge', name: 'Knowledge Base', icon: BookOpenIcon },
    { id: 'stats', name: 'Health Stats', icon: ChartBarIcon },
  ];

  const getRandomCBTExercise = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getRandomCBTExercise();
      if (response.success && response.data) {
        setCbtExercise(response.data);
      }
    } catch (error) {
      console.error('Error fetching CBT exercise:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRandomShifaGuidance = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getHealingDua();
      if (response.success && response.data) {
        setShifaGuidance(response.data);
      }
    } catch (error) {
      console.error('Error fetching Shifa guidance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchKnowledgeBase = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await apiService.searchKnowledgeBase(searchQuery);
      if (response.success && response.data) {
        setSearchResults(response.data.faqs || []);
      }
    } catch (error) {
      console.error('Error searching knowledge base:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'cbt') {
      getRandomCBTExercise();
    } else if (activeTab === 'shifa') {
      getRandomShifaGuidance();
    }
  }, [activeTab]);

  const renderCBTTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">CBT Exercises</h2>
        <button
          onClick={getRandomCBTExercise}
          disabled={isLoading}
          className="btn-primary"
        >
          Get New Exercise
        </button>
      </div>

      {cbtExercise && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center space-x-3 mb-4">
            <CpuChipIcon className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">{cbtExercise.name}</h3>
          </div>
          
          <p className="text-gray-600 mb-4">{cbtExercise.description}</p>
          
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Steps:</h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              {cbtExercise.steps?.map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Duration: {cbtExercise.duration}</span>
            <span>Best for: {cbtExercise.best_for?.join(', ')}</span>
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderShifaTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Shifa Guidance</h2>
        <button
          onClick={getRandomShifaGuidance}
          disabled={isLoading}
          className="btn-primary"
        >
          Get New Guidance
        </button>
      </div>

      {shifaGuidance && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center space-x-3 mb-4">
            <SparklesIcon className="w-6 h-6 text-yellow-600" />
            <h3 className="text-xl font-semibold text-gray-900">Healing Du'a</h3>
          </div>

          {shifaGuidance.arabic && (
            <div className="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
              <div className="arabic-text text-center text-lg font-medium text-gray-800">
                {shifaGuidance.arabic}
              </div>
            </div>
          )}

          {shifaGuidance.transliteration && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Transliteration:</h4>
              <p className="text-gray-600 italic">{shifaGuidance.transliteration}</p>
            </div>
          )}

          {shifaGuidance.translation && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Translation:</h4>
              <p className="text-gray-600">{shifaGuidance.translation}</p>
            </div>
          )}

          <div className="text-sm text-gray-500">
            <p>Source: {shifaGuidance.source}</p>
            {shifaGuidance.recitation_notes && (
              <p className="mt-2">Notes: {shifaGuidance.recitation_notes}</p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderKnowledgeTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Knowledge Base</h2>
      
      <div className="flex space-x-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medical information..."
            className="input-field"
            onKeyPress={(e) => e.key === 'Enter' && searchKnowledgeBase()}
          />
        </div>
        <button
          onClick={searchKnowledgeBase}
          disabled={isLoading || !searchQuery.trim()}
          className="btn-primary"
        >
          <MagnifyingGlassIcon className="w-4 h-4" />
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-4">
          {searchResults.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <h3 className="font-semibold text-gray-900 mb-2">{result.question}</h3>
              <p className="text-gray-600">{result.answer}</p>
              {result.category && (
                <span className="inline-block mt-2 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded">
                  {result.category}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStatsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Health Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <CpuChipIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">CBT Exercises</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Shifa Du'as</p>
              <p className="text-2xl font-bold text-gray-900">6</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <BookOpenIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Medical FAQs</p>
              <p className="text-2xl font-bold text-gray-900">7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <HeartIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ShifaAI Dashboard</h1>
              <p className="text-gray-500">Comprehensive health and wellness tools</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            {activeTab === 'cbt' && renderCBTTab()}
            {activeTab === 'shifa' && renderShifaTab()}
            {activeTab === 'knowledge' && renderKnowledgeTab()}
            {activeTab === 'stats' && renderStatsTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 