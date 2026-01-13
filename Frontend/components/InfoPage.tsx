
import React from 'react';

const InfoPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="animate-fade-in bg-white min-h-screen pb-20">
      <header className="border-b border-gray-100 py-6 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button onClick={onBack} className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            Return
          </button>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Policy Document: V2.4-A</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-black text-primary-dark tracking-tighter mb-4">Infrastructure Comparison</h1>
          <p className="text-gray-500 font-medium">A structured analysis of LineLess managed flow vs. traditional queuing.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Traditional Flow */}
          <div className="p-10 rounded-3xl bg-gray-50 border border-gray-200">
            <h2 className="text-2xl font-black text-gray-400 uppercase tracking-widest mb-10 border-b border-gray-200 pb-4 text-center">Unmanaged Flow</h2>
            
            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-gray-400">01</div>
                <div>
                   <h4 className="font-bold text-primary-dark mb-1">Physical Congestion</h4>
                   <p className="text-sm text-gray-500 leading-relaxed">Waiting rooms at 120% capacity. Increased transmission risk and fire hazard.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-gray-400">02</div>
                <div>
                   <h4 className="font-bold text-primary-dark mb-1">Uncertain Wait Times</h4>
                   <p className="text-sm text-gray-500 leading-relaxed">Citizens arrive blind. Anxiety leads to frequent disputes with front-line staff.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-gray-400">03</div>
                <div>
                   <h4 className="font-bold text-primary-dark mb-1">Discretionary Priority</h4>
                   <p className="text-sm text-gray-500 leading-relaxed">"Who shouts loudest gets served." Manual priority leads to perceived and actual bias.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-red-50 border border-red-100 rounded-xl">
               <p className="text-[10px] font-black text-red-600 uppercase mb-2">Outcome</p>
               <p className="text-sm font-bold text-red-900">High Friction, Low Trust, Variable Throughput.</p>
            </div>
          </div>

          {/* LineLess Infrastructure */}
          <div className="p-10 rounded-3xl bg-primary-dark text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
               <span className="bg-accent text-primary-dark text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded">Recommended</span>
            </div>
            <h2 className="text-2xl font-black text-accent uppercase tracking-widest mb-10 border-b border-white/10 pb-4 text-center">LineLess Managed</h2>
            
            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-accent">01</div>
                <div>
                   <h4 className="font-bold mb-1">Distributed Waiting</h4>
                   <p className="text-sm opacity-60 leading-relaxed">Wait anywhere. Citizen presence only required at service start. Reduced premise load by 85%.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-accent">02</div>
                <div>
                   <h4 className="font-bold mb-1">Predictive Precision</h4>
                   <p className="text-sm opacity-60 leading-relaxed">ML-driven turn forecasting. Citizens arrive 'Just-in-Time'. Staff operate in a calm environment.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-accent">03</div>
                <div>
                   <h4 className="font-bold mb-1">Systemic Fairness</h4>
                   <p className="text-sm opacity-60 leading-relaxed">Rules are code. Priority for seniors and emergencies is hardcoded and transparent.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-white/10 border border-white/20 rounded-xl">
               <p className="text-[10px] font-black text-accent uppercase mb-2">Outcome</p>
               <p className="text-sm font-bold text-white">Low Friction, High Trust, Optimized Throughput.</p>
            </div>
          </div>
        </div>

        <section className="mt-32">
           <h3 className="text-2xl font-black text-primary-dark mb-10 text-center uppercase tracking-widest">Platform Resilience (DIP)</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                 <h5 className="font-bold text-primary mb-2 uppercase text-xs">Fail-Safe State</h5>
                 <p className="text-xs text-gray-500 leading-relaxed">If connectivity drops, the system defaults to manual counter overrides. No citizen data is ever purged from active memory.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                 <h5 className="font-bold text-primary mb-2 uppercase text-xs">Offline Assurance</h5>
                 <p className="text-xs text-gray-500 leading-relaxed">Active tokens are cached locally on operator devices. Service continues regardless of central server status.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                 <h5 className="font-bold text-primary mb-2 uppercase text-xs">Graceful Degradation</h5>
                 <p className="text-xs text-gray-500 leading-relaxed">During high latency, the system increases buffer times automatically to prevent citizen arrival friction.</p>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
};

export default InfoPage;
