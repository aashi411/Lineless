
import React from 'react';

interface NavbarProps {
  onHome: () => void;
  onSetup: () => void;
  onLogin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onHome, onSetup, onLogin }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={onHome}
          >
            <div className="w-10 h-10 bg-primary-dark flex items-center justify-center rounded-xl shadow-lg group-hover:scale-110 transition-transform">
              <div className="w-4 h-4 bg-accent rounded-full animate-pulse" />
            </div>
            <span className="text-2xl font-black text-primary-dark tracking-tighter uppercase">LineLess</span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-6">
            <button 
              onClick={onSetup}
              className="hidden sm:block text-xs font-black text-gray-400 hover:text-primary-dark uppercase tracking-widest transition-colors"
            >
              Partner Access
            </button>
            <button 
              onClick={onLogin}
              className="bg-primary-dark px-6 py-3 rounded-xl text-[10px] font-black text-white hover:bg-primary transition-all shadow-xl active:scale-95 uppercase tracking-[0.2em]"
            >
              System Console
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
