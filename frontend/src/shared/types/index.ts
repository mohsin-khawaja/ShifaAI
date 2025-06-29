// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  request_id?: string;
}

// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  preferences?: UserPreferences;
  created_at: string;
}

export interface UserPreferences {
  language: 'en' | 'ar';
  include_cbt_by_default: boolean;
  include_shifa_by_default: boolean;
  theme: 'light' | 'dark';
}

// Chat/Message Types
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'medical' | 'cbt' | 'shifa' | 'general';
  data?: any;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  confidence_score?: number;
  sources?: string[];
  category?: string;
  language?: string;
}

// Medical Types
export interface HealthQuery {
  question: string;
  include_cbt?: boolean;
  include_shifa?: boolean;
  user_id?: string;
  context?: string;
}

export interface MedicalResponse {
  content: string;
  confidence_score?: number;
  sources?: string[];
  category?: string;
  follow_up_questions?: string[];
  disclaimer?: string;
}

export interface KnowledgeBaseItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  relevance_score?: number;
}

// CBT Types
export interface CBTExercise {
  id: string;
  name: string;
  description: string;
  type: 'breathing' | 'grounding' | 'thought-record' | 'relaxation' | 'behavioral';
  duration_minutes: number;
  steps: string[];
  benefits: string[];
  difficulty_level: 1 | 2 | 3;
}

export interface CBTRecommendation {
  exercise: CBTExercise;
  reasoning: string;
  personalization?: string;
  mood_context?: MoodContext;
}

export interface MoodContext {
  level: number; // 1-10 scale
  description: string;
  triggers?: string[];
  suggested_activities?: string[];
}

// Shifa Types
export interface Dua {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  category: 'healing' | 'protection' | 'anxiety' | 'general';
  source: string;
  benefits: string[];
  usage_instructions?: string;
}

export interface PropheticMedicine {
  id: string;
  name: string;
  arabic_name?: string;
  description: string;
  benefits: string[];
  usage_instructions: string;
  source: string;
  precautions?: string[];
  conditions: string[];
}

export interface ShifaGuidance {
  dua?: Dua;
  remedy?: PropheticMedicine;
  guidance: string;
  context: string;
  category: string;
}

// UI Component Types
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Dashboard/Analytics Types
export interface HealthMetrics {
  total_queries: number;
  medical_queries: number;
  cbt_sessions: number;
  shifa_requests: number;
  user_satisfaction: number;
  most_common_categories: string[];
  recent_activity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'medical' | 'cbt' | 'shifa';
  title: string;
  timestamp: Date;
  status: 'completed' | 'in_progress' | 'cancelled';
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule[];
  options?: SelectOption[];
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern';
  value?: any;
  message: string;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  user_action?: string;
}

// Navigation Types
export interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: string | number;
  children?: NavItem[];
}

// Theme Types
export interface Theme {
  colors: {
    primary: Record<string, string>;
    secondary: Record<string, string>;
    success: Record<string, string>;
    warning: Record<string, string>;
    error: Record<string, string>;
    gray: Record<string, string>;
  };
  spacing: Record<string, string>;
  typography: {
    fontFamily: Record<string, string>;
    fontSize: Record<string, string>;
    fontWeight: Record<string, string>;
  };
} 