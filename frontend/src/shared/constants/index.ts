// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Health & System
  HEALTH_CHECK: '/health',
  
  // Medical
  MEDICAL_ASK: '/medical/ask',
  KNOWLEDGE_SEARCH: '/knowledge/search',
  KNOWLEDGE_CATEGORIES: '/knowledge/categories',
  KNOWLEDGE_RANDOM: '/knowledge/random',
  
  // CBT
  CBT_EXERCISE: '/cbt/exercise',
  CBT_RECOMMENDATION: '/cbt/recommendation',
  CBT_DAILY_TIP: '/cbt/daily-tip',
  
  // Shifa
  SHIFA_GUIDANCE: '/shifa/guidance',
  SHIFA_DUA: '/shifa/dua',
  SHIFA_PROPHETIC_MEDICINE: '/shifa/prophetic-medicine',
  
  // Admin
  ADMIN_STATS: '/admin/stats',
} as const;

// Application Routes
export const ROUTES = {
  HOME: '/',
  CHAT: '/chat',
  DASHBOARD: '/dashboard',
  MEDICAL: '/medical',
  CBT: '/cbt',
  SHIFA: '/shifa',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ABOUT: '/about',
  PRIVACY: '/privacy',
  TERMS: '/terms',
} as const;

// Theme Colors (matching your existing CSS)
export const COLORS = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
} as const;

// CBT Exercise Types
export const CBT_EXERCISE_TYPES = {
  BREATHING: 'breathing',
  GROUNDING: 'grounding',
  THOUGHT_RECORD: 'thought-record',
  RELAXATION: 'relaxation',
  BEHAVIORAL: 'behavioral',
} as const;

// Shifa Categories
export const SHIFA_CATEGORIES = {
  HEALING: 'healing',
  PROTECTION: 'protection',
  ANXIETY: 'anxiety',
  GENERAL: 'general',
} as const;

// Medical Categories
export const MEDICAL_CATEGORIES = [
  'General Health',
  'Mental Health',
  'Nutrition',
  'Exercise',
  'Sleep',
  'Preventive Care',
  'Chronic Conditions',
  'Emergency',
] as const;

// Message Types
export const MESSAGE_TYPES = {
  MEDICAL: 'medical',
  CBT: 'cbt',
  SHIFA: 'shifa',
  GENERAL: 'general',
} as const;

// Toast Types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'shifaai_user_preferences',
  CHAT_HISTORY: 'shifaai_chat_history',
  THEME: 'shifaai_theme',
  LANGUAGE: 'shifaai_language',
} as const;

// Default Values
export const DEFAULTS = {
  LANGUAGE: 'en',
  THEME: 'light',
  INCLUDE_CBT: false,
  INCLUDE_SHIFA: false,
  MESSAGE_LIMIT: 50,
  SEARCH_LIMIT: 10,
  TOAST_DURATION: 5000,
} as const;

// Feature Flags
export const FEATURES = {
  ENABLE_VOICE_INPUT: false,
  ENABLE_DARK_MODE: true,
  ENABLE_ANALYTICS: false,
  ENABLE_OFFLINE_MODE: false,
  ENABLE_NOTIFICATIONS: true,
} as const;

// Validation Rules
export const VALIDATION = {
  MIN_MESSAGE_LENGTH: 3,
  MAX_MESSAGE_LENGTH: 1000,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 30,
  PASSWORD_MIN_LENGTH: 8,
} as const;

// Animation Durations (in milliseconds)
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
} as const;

// Z-Index Layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
} as const; 