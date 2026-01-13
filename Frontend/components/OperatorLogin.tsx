
import React, { useState } from 'react';
import { LineLessAPI } from '../services/api';
import { OperatorSession } from '../types';

interface OperatorLoginProps {
  onLoginSuccess: (session: OperatorSession) => void;
}

const OperatorLogin: React.FC<OperatorLoginProps> = ({ onLoginSuccess }) => {
  const [instId, setInstId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const session = await LineLessAPI.login(instId, email);
      onLoginSuccess(session);
    } catch (err) {
      setError("System Access Denied. Verify Institution ID and Credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputContainerClass = "relative bg-white border-4 border-gray-100 rounded-2xl p-1 focus-within:border-primary transition-all shadow-sm";
  const inputClass = "w-full bg-white border-none px-4 py-4 focus:ring-0 outline-none text-base font-bold text-primary-dark placeholder-gray-300";
  const labelClass = "block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-2";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h1 className="text-3xl font-black text-primary-dark tracking-tighter uppercase">System Management</h1>
          <p className="text-gray-500 font-medium mt-2">Authenticated Access for Service Operators</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl">
          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-100 p-4 rounded-xl text-xs font-black text-red-600 uppercase tracking-widest text-center">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className={labelClass}>Institution ID</label>
              <div className={inputContainerClass}>
                <input 
                  type="text"
                  className={inputClass}
                  placeholder="e.g. HOSP-CITY-99"
                  value={instId}
                  onChange={e => setInstId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Official Email</label>
              <div className={inputContainerClass}>
                <input 
                  type="email"
                  className={inputClass}
                  placeholder="admin@institution.gov"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Security Password</label>
              <div className={inputContainerClass}>
                <input 
                  type="password"
                  className={inputClass}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                disabled={isLoading}
                className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 ${
                  isLoading ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-primary-dark text-white hover:bg-primary shadow-primary/20'
                }`}
              >
                {isLoading ? "Validating..." : "Initialize Session"}
              </button>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed px-6">
              Access is monitored. Unauthorized login attempts are logged into the DPI security audit trail.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OperatorLogin;
