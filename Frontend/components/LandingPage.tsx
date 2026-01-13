
import React from 'react';

interface LandingPageProps {
  onCitizen: () => void;
  onOperator: () => void;
  onInfo: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onCitizen, onOperator, onInfo }) => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100 py-20 lg:py-32 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl lg:text-8xl font-black text-primary-dark mb-10 leading-[1.1] tracking-tighter">
            Eliminate physical waiting. <br />
            <span className="inline-block mt-6 px-8 py-3 bg-accent text-primary-dark rounded-sm transform -rotate-1 shadow-lg">
              Arrive only when it’s your time.
            </span>
          </h1>
          <p className="text-xl text-gray-500 mb-16 max-w-2xl mx-auto font-medium leading-relaxed">
            LineLess is Digital Public Infrastructure for time. We manage high-volume service access through fair, predictable, and decentralized virtual queues.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-left max-w-5xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-2xl border-l-4 border-primary">
              <h3 className="font-black text-primary-dark mb-3 uppercase text-xs tracking-widest">Predictability</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Know exactly when you will be served before you even leave your residence.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl border-l-4 border-primary">
              <h3 className="font-black text-primary-dark mb-3 uppercase text-xs tracking-widest">Fair Access</h3>
              <p className="text-sm text-gray-500 leading-relaxed">System-enforced priority logic ensures the vulnerable are served without physical struggle.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl border-l-4 border-primary">
              <h3 className="font-black text-primary-dark mb-3 uppercase text-xs tracking-widest">Decentralized</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Wait anywhere. The system manages the physical premise load on your behalf.</p>
            </div>
          </div>

          <button onClick={onInfo} className="text-sm font-black text-primary hover:underline uppercase tracking-widest">
            View Infrastructure Comparison (A/B)
          </button>
        </div>
      </section>

      {/* Role Selection */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Citizen Path */}
          <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-200 flex flex-col hover:shadow-2xl transition-all group">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <h2 className="text-4xl font-black text-primary-dark mb-6">Citizens</h2>
            <p className="text-gray-500 mb-10 font-medium text-lg leading-relaxed">Access public services, hospitals, and entertainment hubs without the uncertainty of standing in line.</p>
            <ul className="space-y-5 mb-12 text-sm text-gray-400 font-bold uppercase tracking-widest">
              <li className="flex items-center gap-4"><span className="w-2 h-2 bg-accent rounded-full"></span> No Charges / Fees</li>
              <li className="flex items-center gap-4"><span className="w-2 h-2 bg-accent rounded-full"></span> Transit-Aware Alerts</li>
              <li className="flex items-center gap-4"><span className="w-2 h-2 bg-accent rounded-full"></span> Predictive turn tracking</li>
            </ul>
            <button 
              onClick={onCitizen}
              className="mt-auto bg-primary-dark text-white font-black py-6 rounded-2xl hover:bg-primary transition-all shadow-xl active:scale-95 text-lg uppercase tracking-widest"
            >
              Access Public Services
            </button>
          </div>

          {/* Operator Path */}
          <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-200 flex flex-col hover:shadow-2xl transition-all group">
             <div className="w-16 h-16 bg-primary-dark rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m4 0h1m-5 10h1m4 0h1m-5-4h1m4 0h1" /></svg>
            </div>
            <h2 className="text-4xl font-black text-primary-dark mb-6">Institutions</h2>
            <p className="text-gray-500 mb-10 font-medium text-lg leading-relaxed">Control premise congestion, manage staff throughput, and eliminate operational chaos.</p>
            <ul className="space-y-5 mb-12 text-sm text-gray-400 font-bold uppercase tracking-widest">
              <li className="flex items-center gap-4"><span className="w-2 h-2 bg-primary rounded-full"></span> Command Console</li>
              <li className="flex items-center gap-4"><span className="w-2 h-2 bg-primary rounded-full"></span> Priority Enforcement</li>
              <li className="flex items-center gap-4"><span className="w-2 h-2 bg-primary rounded-full"></span> Operational Health ML</li>
            </ul>
            <button 
              onClick={onOperator}
              className="mt-auto border-4 border-primary-dark text-primary-dark font-black py-6 rounded-2xl hover:bg-primary-dark hover:text-white transition-all active:scale-95 text-lg uppercase tracking-widest"
            >
              System Console
            </button>
          </div>
        </div>
      </section>

      {/* Institutional Explainer */}
      <section className="py-32 px-4 bg-primary-dark text-white overflow-hidden relative">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <p className="text-accent font-black uppercase tracking-[0.4em] text-xs mb-10">Institutional Alignment</p>
          <h2 className="text-5xl lg:text-6xl font-black mb-16 tracking-tighter">How LineLess scales your capacity.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-left">
            <div className="space-y-10">
              <div className="border-l-4 border-accent pl-8">
                <h4 className="text-2xl font-bold mb-3">Eliminate Crowd Chaos</h4>
                <p className="text-base opacity-70 leading-relaxed">By distributing arrivals, your lobby and waiting rooms are reclaimed for their intended purpose, not storage for bodies.</p>
              </div>
              <div className="border-l-4 border-accent pl-8">
                <h4 className="text-2xl font-bold mb-3">Staff Predictability</h4>
                <p className="text-base opacity-70 leading-relaxed">Counter operators receive a steady, predictable flow of citizens. This reduces burnout and eliminates the 'rush hour' dispute cycle.</p>
              </div>
            </div>
            <div className="space-y-10">
              <div className="border-l-4 border-accent pl-8">
                <h4 className="text-2xl font-bold mb-3">Zero Citizen Charges</h4>
                <p className="text-base opacity-70 leading-relaxed">LineLess is infrastructure. We do not monetize citizen access. Institutions pay for the orchestration layer to improve their own efficiency.</p>
              </div>
              <div className="border-l-4 border-accent pl-8">
                <h4 className="text-2xl font-bold mb-3">Operational Sovereignty</h4>
                <p className="text-base opacity-70 leading-relaxed">You retain full override control. Priority logic, counter status, and emergency protocols remain in institutional hands.</p>
              </div>
            </div>
          </div>

          <div className="mt-24 p-12 border border-white/10 rounded-[3rem] bg-white/5 backdrop-blur-sm">
             <p className="text-sm font-black uppercase tracking-[0.3em] opacity-40 mb-6">Public Utility Status</p>
             <p className="text-2xl italic font-medium opacity-90 leading-relaxed">"LineLess is not an app. It is a protocol for time, ensuring that the most valuable resource—human time—is not wasted in physical friction."</p>
          </div>
        </div>
        <div className="absolute -bottom-48 -right-48 w-128 h-128 bg-primary rounded-full blur-[160px] opacity-20" />
      </section>
    </div>
  );
};

export default LandingPage;
