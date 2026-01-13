
import React, { useState } from 'react';
import { UserRole, OperatorSession } from './types';
import LandingPage from './components/LandingPage';
import CitizenDashboard from './components/CitizenDashboard';
import OperatorDashboard from './components/OperatorDashboard';
import OperatorLogin from './components/OperatorLogin';
import SetupFlow from './components/SetupFlow';
import Navbar from './components/Navbar';
import ChatAssistant from './components/ChatAssistant';
import InfoPage from './components/InfoPage';

const App: React.FC = () => {
  const [view, setView] = useState<'LANDING' | 'CITIZEN' | 'OPERATOR' | 'OPERATOR_LOGIN' | 'SETUP' | 'INFO'>('LANDING');
  const [session, setSession] = useState<OperatorSession | null>(null);

  const navigateTo = (target: 'LANDING' | 'CITIZEN' | 'OPERATOR' | 'OPERATOR_LOGIN' | 'SETUP' | 'INFO') => {
    window.scrollTo(0, 0);
    setView(target);
  };

  const handleOperatorAuth = (newSession: OperatorSession) => {
    setSession(newSession);
    navigateTo('OPERATOR');
  };

  const handleLogout = () => {
    setSession(null);
    navigateTo('LANDING');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 selection:bg-accent selection:text-primary-dark">
      {view !== 'INFO' && view !== 'OPERATOR' && (
        <Navbar 
          onHome={() => navigateTo('LANDING')} 
          onSetup={() => navigateTo('SETUP')} 
          onLogin={() => navigateTo('OPERATOR_LOGIN')}
        />
      )}
      
      <main className="flex-grow">
        {view === 'LANDING' && (
          <LandingPage 
            onCitizen={() => navigateTo('CITIZEN')} 
            onOperator={() => navigateTo('OPERATOR_LOGIN')} 
            onInfo={() => navigateTo('INFO')}
          />
        )}
        
        {view === 'CITIZEN' && <CitizenDashboard />}
        
        {view === 'OPERATOR_LOGIN' && (
          <OperatorLogin onLoginSuccess={handleOperatorAuth} />
        )}
        
        {view === 'OPERATOR' && session && (
          <OperatorDashboard session={session} onLogout={handleLogout} />
        )}
        
        {view === 'SETUP' && (
          <SetupFlow onComplete={() => navigateTo('LANDING')} />
        )}

        {view === 'INFO' && (
          <InfoPage onBack={() => navigateTo('LANDING')} />
        )}
      </main>

      <ChatAssistant />

      {view !== 'OPERATOR' && (
        <footer className="bg-white border-t border-gray-200 py-8 px-4 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 font-bold uppercase tracking-widest gap-4 text-center md:text-left">
            <div className="flex items-center gap-2">
              <span className="text-primary-dark">LineLess</span>
              <span className="opacity-50">DPI Stack V2.4.0</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <button onClick={() => navigateTo('SETUP')} className="hover:text-primary transition-colors">Institutional Access</button>
              <button onClick={() => navigateTo('INFO')} className="hover:text-primary transition-colors">DPI Protocol</button>
              <span className="opacity-50">Uptime: 99.99%</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
