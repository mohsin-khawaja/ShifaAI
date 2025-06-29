# ShifaAI Frontend

A modern React.js frontend for the ShifaAI health companion application.

## Features

- **Chat Interface**: Real-time conversation with AI health assistant
- **Dashboard**: CBT exercises, Shifa guidance, and knowledge base search
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS and Framer Motion
- **TypeScript**: Full type safety and better development experience

## Prerequisites

- Node.js 16+ 
- npm or yarn
- ShifaAI backend running on localhost:8000

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
# or
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` - Start development server
- `npm start` - Start development server (alias for dev)
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Project Structure

```
src/
├── components/          # React components
│   ├── ChatInterface.tsx    # Main chat interface
│   └── Dashboard.tsx        # Dashboard with tabs
├── services/           # API services
│   └── api.ts             # API client and types
├── App.tsx            # Main app component
├── index.tsx          # App entry point
└── index.css          # Global styles with Tailwind
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:8000
```

## Features

### Chat Interface
- Real-time messaging with AI
- Toggle CBT and Shifa features
- Arabic text support for du'as
- Loading states and animations

### Dashboard
- **CBT Exercises**: Get random cognitive behavioral therapy exercises
- **Shifa Guidance**: Islamic healing du'as and guidance
- **Knowledge Base**: Search medical FAQs
- **Health Stats**: Overview of available resources

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Axios** - HTTP client
- **Heroicons** - Icons

## Development

The frontend connects to the FastAPI backend running on localhost:8000. Make sure the backend is running before using the frontend.

## Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Test your changes thoroughly
4. Update documentation as needed
