import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ChatBubbleLeftRightIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import ChatPage from './pages/chat.page';
import Dashboard from './components/Dashboard';
import { ROUTES } from './shared/constants';
import './App.css';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: ROUTES.HOME, label: 'Chat', icon: ChatBubbleLeftRightIcon },
    { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: ChartBarIcon },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-full shadow-lg border border-gray-200 px-4 py-2">
        <div className="flex space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Routes>
          <Route path={ROUTES.HOME} element={<ChatPage />} />
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        </Routes>
        <Navigation />
      </div>
    </Router>
  );
};

export default App;
