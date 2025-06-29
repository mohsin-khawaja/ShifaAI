# ShifaAI
**Your AI health companion: instant medical answers, supportive CBT coaching, and holistic healing guidance.**

A modern, unified Node.js and React.js application that provides comprehensive AI health support combining:

* **Medical FAQ Engine**: Intelligent medical question answering with knowledge base search
* **GPT-4 Medical Assistant**: AI-powered health guidance with empathetic responses
* **CBT Coaching Module**: Evidence-based Cognitive Behavioral Therapy exercises and techniques
* **Islamic-Compliant "Shifa" Layer**: Authentic du'as and prophetic medicine recommendations
* **Modern Web Interface**: Beautiful React.js frontend with real-time chat capabilities
* **Unified Node.js Backend**: Express.js API with comprehensive health endpoints

---

## **Optimal Architecture**

**Frontend**: React.js with TypeScript, Tailwind CSS, and Framer Motion
**Backend**: Node.js with Express.js and OpenAI integration
**Development**: Unified development environment with concurrent servers
**Deployment**: Single application with static file serving for production

---

## **Features**

* **Medical Q&A**: Intelligent health question answering with AI and knowledge base
* **CBT Coaching**: Personalized cognitive behavioral therapy exercises
* **Shifa Guidance**: Authentic Islamic healing with du'as and prophetic medicine
* **Modern UI**: Responsive React interface with beautiful animations
* **Real-time Chat**: Interactive chat interface with medical, CBT, and Shifa responses
* **Knowledge Search**: Comprehensive medical FAQ search with relevance scoring
* **Dashboard**: Health insights, exercise tracking, and guidance history

---

## **Quick Start**

### Prerequisites

* Node.js 16+ and npm
* OpenAI API key (optional, fallback mode available)

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/shifaai.git
cd shifaai

# Install all dependencies (backend + frontend)
npm run install:all

# Set up environment variables
cp sample_env .env
# Edit .env with your OpenAI API key

# Start development environment (both servers)
npm run dev
```

###**Access Points**

- **Main Application**: http://localhost:3000
- **API Documentation**: http://localhost:8000/api/health
- **Backend API**: http://localhost:8000/api

---

## **Available Scripts**

```bash
# Development
npm run dev              # Start both backend and frontend
npm run server:dev       # Start only Node.js backend
npm run client:dev       # Start only React frontend

# Production
npm run build           # Build React app for production
npm start              # Start production server

# Utilities
npm run install:all     # Install all dependencies
npm test               # Run all tests
```

---

## **Project Structure**

```text
shifaai/
├── server/                     # Node.js Express backend
│   ├── index.js               # Main server file
│   └── routes/                # API route modules
│       ├── health.js          # Health check endpoints
│       ├── medical.js         # Medical Q&A with OpenAI
│       ├── cbt.js            # CBT exercises and recommendations
│       ├── shifa.js          # Islamic healing guidance
│       └── knowledge.js       # Medical knowledge base
├── frontend/                   # React.js application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ChatInterface.tsx
│   │   │   └── Dashboard.tsx
│   │   └── services/
│   │       └── api.ts         # API service layer
│   └── public/                # Static assets
├── package.json               # Root dependencies & scripts
└── README.md
```

---

## **API Endpoints**

### Medical
- `POST /api/medical/ask` - Ask health questions with AI responses
- `GET /api/knowledge/search` - Search medical knowledge base
- `GET /api/knowledge/categories` - Get medical categories

### CBT (Cognitive Behavioral Therapy)
- `GET /api/cbt/exercise` - Get random CBT exercise
- `POST /api/cbt/recommendation` - Get personalized CBT recommendation
- `GET /api/cbt/daily-tip` - Get daily CBT wisdom

### Shifa (Islamic Healing)
- `GET /api/shifa/dua` - Get healing du'a
- `GET /api/shifa/prophetic-medicine` - Get prophetic medicine
- `POST /api/shifa/guidance` - Get comprehensive Shifa guidance

### System
- `GET /api/health` - Health check and system status

---

## **Key Benefits of This Architecture**

### ** Performance**
- Single Node.js runtime for both frontend and backend
- Optimized API calls with unified error handling
- Built-in compression and security middleware

### ** Development Experience**
- Unified package management with npm
- Concurrent development servers with hot reload
- Shared TypeScript types between frontend and backend
- Single deployment process

### ** Deployment Simplicity**
- Single application to deploy
- Static file serving in production
- Environment-based configuration
- Docker-ready architecture

### ** Security & Reliability**
- Helmet.js security headers
- CORS configuration
- Request validation and error handling
- Comprehensive logging

---

## **Production Deployment**

```bash
# Build for production
npm run build

# Set production environment
export NODE_ENV=production

# Start production server
npm start
```

The application serves the React build files statically in production mode, making it a single deployable unit.

---

## **Contributing**

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on setting up your environment, submitting PRs, and our code of conduct.

---

## **License**

This project is MIT licensed. See [LICENSE](./LICENSE) for details.

---

## **Contact**

Maintained by **Mohsin Khawaja**. Feel free to open issues or submit pull requests!

** Experience the future of holistic health care with ShifaAI - where modern AI meets traditional healing wisdom.**

# Single command to start everything:
npm run dev

# Access points:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/api
# Health Check: http://localhost:8000/api/health
