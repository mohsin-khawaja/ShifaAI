import { STORAGE_KEYS, DEFAULTS } from '../constants';
import type { UserPreferences, Message, AppError } from '../types';

// Date & Time Utilities
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(date);
};

// String Utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const extractKeywords = (text: string): string[] => {
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.includes(word))
    .slice(0, 10); // Limit to 10 keywords
};

// Array Utilities
export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const unique = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

// Local Storage Utilities
export const getStoredPreferences = (): UserPreferences => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    if (stored) {
      return { ...getDefaultPreferences(), ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Error reading stored preferences:', error);
  }
  return getDefaultPreferences();
};

export const setStoredPreferences = (preferences: Partial<UserPreferences>): void => {
  try {
    const current = getStoredPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated));
  } catch (error) {
    console.error('Error storing preferences:', error);
  }
};

export const getDefaultPreferences = (): UserPreferences => ({
  language: DEFAULTS.LANGUAGE as 'en' | 'ar',
  include_cbt_by_default: DEFAULTS.INCLUDE_CBT,
  include_shifa_by_default: DEFAULTS.INCLUDE_SHIFA,
  theme: DEFAULTS.THEME as 'light' | 'dark',
});

export const getChatHistory = (): Message[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    if (stored) {
      const messages = JSON.parse(stored);
      return messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    }
  } catch (error) {
    console.error('Error reading chat history:', error);
  }
  return [];
};

export const setChatHistory = (messages: Message[]): void => {
  try {
    // Limit stored messages to prevent storage overflow
    const limitedMessages = messages.slice(-DEFAULTS.MESSAGE_LIMIT);
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(limitedMessages));
  } catch (error) {
    console.error('Error storing chat history:', error);
  }
};

// Validation Utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Error Handling Utilities
export const createAppError = (
  code: string,
  message: string,
  details?: any,
  userAction?: string
): AppError => ({
  code,
  message,
  details,
  timestamp: new Date(),
  user_action: userAction,
});

export const logError = (error: AppError | Error): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Application Error:', error);
  }
  
  // In production, you might want to send this to an error tracking service
  // like Sentry, LogRocket, etc.
};

// DOM Utilities
export const scrollToTop = (behavior: ScrollBehavior = 'smooth'): void => {
  window.scrollTo({ top: 0, behavior });
};

export const scrollToElement = (elementId: string, behavior: ScrollBehavior = 'smooth'): void => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior });
  }
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

// URL Utilities
export const getQueryParams = (): Record<string, string> => {
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
};

export const updateQueryParams = (params: Record<string, string>): void => {
  const searchParams = new URLSearchParams(window.location.search);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
  });
  
  const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
  window.history.replaceState({}, '', newUrl);
};

// Performance Utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

// Random Utilities
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Health-specific Utilities
export const categorizeHealthQuery = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('mental') || lowerQuery.includes('anxiety') || lowerQuery.includes('depression') || lowerQuery.includes('stress')) {
    return 'Mental Health';
  }
  if (lowerQuery.includes('diet') || lowerQuery.includes('nutrition') || lowerQuery.includes('food') || lowerQuery.includes('vitamin')) {
    return 'Nutrition';
  }
  if (lowerQuery.includes('exercise') || lowerQuery.includes('fitness') || lowerQuery.includes('workout') || lowerQuery.includes('physical')) {
    return 'Exercise';
  }
  if (lowerQuery.includes('sleep') || lowerQuery.includes('insomnia') || lowerQuery.includes('rest')) {
    return 'Sleep';
  }
  if (lowerQuery.includes('emergency') || lowerQuery.includes('urgent') || lowerQuery.includes('severe')) {
    return 'Emergency';
  }
  
  return 'General Health';
};

export const calculateConfidenceScore = (sources: string[], contentLength: number): number => {
  let score = 0.5; // Base score
  
  // Increase score based on number of sources
  score += Math.min(sources.length * 0.1, 0.3);
  
  // Increase score based on content length (more detailed responses)
  if (contentLength > 200) score += 0.1;
  if (contentLength > 500) score += 0.1;
  
  return Math.min(score, 1.0);
}; 