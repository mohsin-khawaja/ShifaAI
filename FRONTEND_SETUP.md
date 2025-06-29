# ShifaAI Frontend Setup Guide

This guide will help you set up and run the ShifaAI React frontend with the FastAPI backend.

## Prerequisites

- Node.js 16+ installed
- Python 3.9+ with FastAPI backend running
- OpenAI API key configured

## Quick Start

### 1. Start the FastAPI Backend

First, make sure your FastAPI backend is running:

```bash
# In the root directory
uvicorn backend.app:app --reload
```

The backend should be running on http://localhost:8000

### 2. Start the React Frontend

In a new terminal, navigate to the frontend directory and start the development server:

```bash
cd frontend
npm install
npm run dev
```

The frontend will open at http://localhost:3000

## Detailed Setup

### Backend Setup

1. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

2. **Configure environment variables:**
```bash
cp sample_env .env
# Edit .env and add your OpenAI API key
```

3. **Start the backend:**
```bash
uvicorn backend.app:app --reload
```

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure API URL (optional):**
Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:8000
```

4. **Start development server:**
```bash
npm run dev
```

## Features

### Chat Interface
- Real-time conversation with AI health assistant
- Toggle CBT (Cognitive Behavioral Therapy) exercises
- Toggle Shifa (Islamic healing) guidance
- Arabic text support for du'as
- Responsive design for mobile and desktop

### Dashboard
- **CBT Exercises**: Get random therapeutic exercises
- **Shifa Guidance**: Islamic healing du'as and remedies
- **Knowledge Base**: Search medical FAQs
- **Health Stats**: Overview of available resources

## Troubleshooting

### Backend Issues

1. **Port 8000 already in use:**
```bash
uvicorn backend.app:app --reload --port 8001
```

2. **OpenAI API errors:**
- Check your API key in `.env`
- Ensure you have sufficient credits
- Try using a different model in `backend/utils.py`

3. **Import errors:**
```bash
pip install -r requirements.txt
```

### Frontend Issues

1. **Port 3000 already in use:**
The React dev server will automatically suggest an alternative port.

2. **API connection errors:**
- Ensure backend is running on localhost:8000
- Check CORS settings in backend
- Verify API endpoints in browser dev tools

3. **Build errors:**
```bash
npm install
npm run build
```

## Development Workflow

1. **Backend development:**
   - Edit files in `backend/` directory
   - Backend auto-reloads with `--reload` flag
   - Check logs in terminal

2. **Frontend development:**
   - Edit files in `frontend/src/` directory
   - Frontend auto-reloads with hot reload
   - Check browser dev tools for errors

3. **Testing the full stack:**
   - Backend: http://localhost:8000/docs (API docs)
   - Frontend: http://localhost:3000 (React app)
   - Test chat functionality
   - Test dashboard features

## Production Deployment

### Backend
```bash
uvicorn backend.app:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm run build
# Serve the build folder with a web server
```

## File Structure

```
ShifaAI/
├── backend/              # FastAPI backend
│   ├── app.py           # Main API
│   ├── cbt.py           # CBT module
│   ├── shifa.py         # Islamic healing
│   └── utils.py         # Utilities
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API client
│   │   └── App.tsx      # Main app
│   └── package.json
├── requirements.txt     # Python dependencies
└── .env                # Environment variables
```

## API Endpoints

The frontend connects to these backend endpoints:

- `POST /ask` - Main health query
- `POST /cbt/recommendation` - CBT exercises
- `GET /cbt/exercise` - Random CBT exercise
- `POST /shifa/guidance` - Islamic healing
- `GET /shifa/dua` - Healing du'as
- `GET /knowledge/search` - Medical FAQs
- `GET /health` - Health check

## Next Steps

1. **Customize the UI**: Edit components in `frontend/src/components/`
2. **Add new features**: Extend the API in `backend/`
3. **Improve styling**: Modify Tailwind classes in components
4. **Add tests**: Create test files for components and API
5. **Deploy**: Set up production deployment

## Support

If you encounter issues:

1. Check the browser console for frontend errors
2. Check the terminal for backend errors
3. Verify all dependencies are installed
4. Ensure both servers are running
5. Check network connectivity between frontend and backend 