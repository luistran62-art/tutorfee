import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { TuitionCalculator } from './components/TuitionCalculator';
import { MOCK_EVENTS, MOCK_EMAILS, MOCK_STUDENTS } from './constants';
import { CalendarEvent, UserProfile } from './types';

function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Application Data State
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [students] = useState(MOCK_STUDENTS);
  const [emails] = useState(MOCK_EMAILS);

  // Handlers
  const handleLogin = () => {
    // In a real app, this would handle the OAuth token
    // Here we simulate a successful Google Login response
    setUser({
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@gmail.com',
      avatarUrl: '' // Empty for placeholder generation in Layout
    });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setActiveTab('dashboard'); // Reset tab
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard events={events} students={students} />;
      case 'calculator':
        return (
          <TuitionCalculator 
            events={events} 
            students={students} 
            emails={emails} 
            setEvents={setEvents}
          />
        );
      default:
        return <Dashboard events={events} students={students} />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      user={user!} 
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;