# ShifaAI Frontend Architecture

## 🏗 **Feature-Driven Architecture Overview**

This frontend follows a **"Screaming Architecture"** pattern inspired by modern React best practices and the MunchMate project structure. The architecture clearly communicates what the application does (health, medical, CBT, Shifa) rather than just showing it's a React app.

## 📁 **Folder Structure**

```
frontend/src/
├── features/                    # Feature-based modules (the heart of the app)
│   ├── medical/                # 🩺 Medical AI & Knowledge Base
│   │   ├── components/
│   │   │   ├── medical-chat/
│   │   │   └── knowledge-search/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts           # Public API of medical feature
│   ├── cbt/                   # 🧠 Cognitive Behavioral Therapy
│   ├── shifa/                 # 🌟 Islamic Healing & Prophetic Medicine
│   ├── ui/                    # 🎨 Reusable UI Components
│   │   ├── button/
│   │   ├── input/
│   │   ├── card/
│   │   └── index.ts           # Public API of UI components
│   └── auth/                  # 🔐 Authentication (future)
├── shared/                    # Shared utilities across features
│   ├── types/                 # TypeScript type definitions
│   ├── constants/             # App-wide constants
│   ├── utils/                 # Utility functions
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # API services
│   └── index.ts              # Public API of shared utilities
├── pages/                     # Page components (entry points)
│   ├── chat.page.tsx         # Main chat interface
│   ├── dashboard.page.tsx    # Analytics dashboard
│   └── index.ts              # Public API of pages
├── assets/                    # Static assets
└── App.tsx                   # Root application component
```

## 🎯 **Key Architectural Principles**

### 1. **Feature-First Organization**
- Code is organized by **business features** (medical, CBT, Shifa) rather than technical concerns
- Each feature is self-contained with its own components, services, and types
- Easy to understand what the app does at a glance

### 2. **Barrel Exports (Public APIs)**
- Every folder has an `index.ts` file that acts as its "public API"
- Clean imports: `import { MedicalChat } from '@features/medical'`
- Internal implementation details are hidden
- Easy refactoring without breaking external dependencies

### 3. **Absolute Imports**
- No more `../../../` import hell
- Clear, predictable import paths
- Configured via `tsconfig.json` paths

### 4. **Shared vs Feature-Specific**
- **Shared**: Used across multiple features (types, hooks, utilities)
- **Feature-Specific**: Only used within one feature (components, services)

### 5. **Colocation**
- Related files are kept together
- Components live with their styles, tests, and related utilities
- Easier to find and maintain code

## 🚀 **Import Patterns**

### ✅ **Good Imports**
```typescript
// Feature imports
import { MedicalChat, KnowledgeSearch } from '@features/medical';
import { Button, Input, Card } from '@features/ui';

// Shared imports  
import { useAsyncState, useChatHistory } from '@shared/hooks';
import { apiService } from '@shared/services/api';
import { ROUTES, API_ENDPOINTS } from '@shared/constants';
import type { Message, HealthQuery } from '@shared/types';

// Page imports
import { ChatPage } from '@pages';
```

### ❌ **Avoid These Imports**
```typescript
// Don't import internal implementation details
import MedicalChat from '@features/medical/components/medical-chat/medical-chat.component';

// Don't use relative imports for shared utilities
import { apiService } from '../../../shared/services/api';

// Don't cross-import between features
import { CBTExercise } from '@features/cbt/components/exercise-card/exercise.component';
```

## 🧩 **Feature Structure**

Each feature follows this consistent structure:

```
feature-name/
├── components/           # Feature-specific React components
│   ├── component-name/
│   │   ├── component-name.component.tsx
│   │   ├── component-name.test.tsx
│   │   ├── component-name.styles.css
│   │   └── index.ts     # Component's public API
├── services/            # Feature-specific API calls
├── hooks/               # Feature-specific custom hooks
├── types/               # Feature-specific TypeScript types
├── utils/               # Feature-specific utilities
└── index.ts            # Feature's public API
```

## 🎨 **UI Components**

The UI feature contains reusable components that are used across the application:

- **Button**: Multiple variants, sizes, loading states
- **Input**: Form inputs with validation, icons, labels
- **Card**: Flexible container component
- **Toast**: Notification system
- **Modal**: Dialog system
- **Loading**: Loading indicators

### Usage Example:
```typescript
import { Button, Input, Card } from '@features/ui';

<Card padding="lg" shadow="md">
  <Input 
    label="Your question"
    placeholder="Ask about your health..."
    leftIcon={<HeartIcon />}
  />
  <Button 
    variant="primary" 
    size="lg" 
    isLoading={loading}
    leftIcon={<PaperAirplaneIcon />}
  >
    Send
  </Button>
</Card>
```

## 🩺 **Medical Feature**

The medical feature handles health-related functionality:

- **MedicalChat**: AI-powered health question interface
- **KnowledgeSearch**: Search medical FAQs and knowledge base
- **MedicalResponse**: Display AI responses with confidence scores
- **DisclaimerCard**: Medical disclaimer component

### Key Services:
- Health question processing
- Knowledge base search
- Medical FAQ retrieval
- Response categorization

## 🧠 **CBT Feature** (Coming Soon)

Cognitive Behavioral Therapy tools and exercises:

- **CBTExerciseCard**: Display therapy exercises
- **MoodTracker**: Track emotional states
- **ThoughtRecord**: CBT thought recording tool
- **BreathingExercise**: Guided breathing sessions

## 🌟 **Shifa Feature** (Coming Soon)

Islamic healing and prophetic medicine:

- **DuaCard**: Display healing du'as with Arabic text
- **PropheticMedicine**: Show prophetic remedies
- **IslamicGuidance**: Comprehensive Shifa guidance
- **ArabicText**: Proper Arabic text rendering

## 🔧 **Development Guidelines**

### Adding a New Feature
1. Create feature directory: `src/features/feature-name/`
2. Add components, services, types as needed
3. Create `index.ts` with public API exports
4. Update `src/features/index.ts` to include new feature
5. Add feature to main app routing/navigation

### Adding a New Component
1. Create component directory with descriptive name
2. Follow naming convention: `component-name.component.tsx`
3. Add TypeScript interface for props
4. Create `index.ts` for clean exports
5. Add to parent feature's `index.ts`

### Adding Shared Utilities
1. Determine if it's truly shared (used by 2+ features)
2. Add to appropriate shared folder (hooks, utils, types, etc.)
3. Export from shared `index.ts`
4. Document with JSDoc comments

## 📊 **Benefits of This Architecture**

### 🚀 **Developer Experience**
- **Faster Development**: Clear structure, no time wasted finding files
- **Better Collaboration**: Team members can work on different features independently
- **Easier Onboarding**: New developers understand the codebase quickly

### 🔧 **Maintainability**
- **Isolated Changes**: Feature changes don't affect other features
- **Clear Dependencies**: Easy to see what depends on what
- **Refactoring Safety**: Internal changes don't break external code

### 📈 **Scalability**
- **Feature Teams**: Different teams can own different features
- **Incremental Development**: Add new features without touching existing code
- **Code Reuse**: Shared utilities prevent duplication

### 🧪 **Testing**
- **Feature Testing**: Test features in isolation
- **Component Testing**: Each component is independently testable
- **Integration Testing**: Clear boundaries between features

## 🔮 **Future Enhancements**

### Planned Features
- **CBT Module**: Complete therapy exercise system
- **Shifa Module**: Islamic healing guidance
- **Auth Module**: User authentication and profiles
- **Dashboard Module**: Health analytics and insights

### Technical Improvements
- **State Management**: Add Zustand or Redux Toolkit for complex state
- **Error Boundaries**: Feature-level error handling
- **Lazy Loading**: Code-split features for better performance
- **PWA Support**: Offline functionality
- **Internationalization**: Multi-language support

## 📚 **Learning Resources**

This architecture is inspired by:
- [Bulletproof React](https://github.com/alan2207/bulletproof-react)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Screaming Architecture](https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html)
- [React Folder Structure Best Practices](https://profy.dev/article/react-folder-structure)

---

**This architecture ensures ShifaAI remains maintainable, scalable, and developer-friendly as it grows into a comprehensive health platform.** 🚀 