import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { Input, Card } from '../../../ui';
import { useAsyncState, useDebounce } from '../../../../shared/hooks';
import { apiService } from '../../../../shared/services/api';
import type { KnowledgeBaseItem, ApiResponse } from '../../../../shared/types';
import { truncateText } from '../../../../shared/utils';

interface KnowledgeSearchProps {
  onResultClick?: (item: KnowledgeBaseItem) => void;
  className?: string;
}

const KnowledgeSearch: React.FC<KnowledgeSearchProps> = ({
  onResultClick,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<KnowledgeBaseItem[]>([]);
  const { loading, execute } = useAsyncState<ApiResponse<KnowledgeBaseItem[]>>();
  
  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      try {
        const response = await execute(() => 
          apiService.searchKnowledgeBase(debouncedQuery, { limit: 5 })
        );

        if (response && response.success && response.data) {
          setResults(response.data);
        }
      } catch (error) {
        console.error('Error searching knowledge base:', error);
        setResults([]);
      }
    };

    performSearch();
  }, [debouncedQuery, execute]);

  const handleResultClick = (item: KnowledgeBaseItem) => {
    onResultClick?.(item);
    setSearchQuery('');
    setResults([]);
  };

  return (
    <Card className={className} padding="lg">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
          <BookOpenIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Knowledge Base</h3>
          <p className="text-sm text-gray-500">Search medical FAQs and information</p>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search medical topics..."
          leftIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
          fullWidth
        />

        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            <span className="ml-2 text-sm text-gray-500">Searching...</span>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.map((item) => (
              <div
                key={item.id}
                onClick={() => handleResultClick(item)}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <h4 className="font-medium text-gray-900 mb-1">
                  {item.question}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {truncateText(item.answer, 120)}
                </p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {item.category}
                  </span>
                  {item.relevance_score && (
                    <span className="text-xs text-gray-500">
                      {Math.round(item.relevance_score * 100)}% match
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {searchQuery && !loading && results.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <BookOpenIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No results found for "{searchQuery}"</p>
            <p className="text-sm">Try different keywords or ask a direct question</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default KnowledgeSearch; 