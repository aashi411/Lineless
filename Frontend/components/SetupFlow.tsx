
import React, { useState } from 'react';

const SetupFlow: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    city: '',
    serviceType: 'Government Office',
    footfall: 500,
    serviceTime: 15,
    counters: 10
  });

  const [submitted, setSubmitted] = useState(false);

  // Estimates (Dummy logic)
  const waitReduction = 75; // 75% reduction
  const crowdReduction = 90; // 90% physical crowd reduction
  const costEstimate = Math.round(formData.footfall * 0.5 + 500);

  const inputClass = "w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all text-sm font-medium text-primary-dark";
  const selectClass = "w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-accent outline-none transition-all text-sm font-medium text-primary-dark appearance-none cursor-pointer";

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center animate-fade-in">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="text-3xl font-bold text-primary-dark mb-4">Request Transmitted</h1>
        <p className="text-gray-600 mb-10">Our deployment officer will review your parameters and contact your administration within 24 business hours.</p>
        <button onClick={onComplete} className="bg-primary text-white font-bold py-3 px-8 rounded-lg">Return Home</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Input Form */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <h1 className="text-2xl font-bold text-primary-dark mb-2">Institutional Setup</h1>
          <p className="text-sm text-gray-500 mb-8 font-medium border-b border-gray-100 pb-4">
            Phase 1: Flow Analysis & Estimation
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Service City / Area</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="e.g. New York, NY"
                  className={inputClass}
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Service Type</label>
              <div className="relative">
                <select 
                  className={selectClass}
                  value={formData.serviceType}
                  onChange={e => setFormData({...formData, serviceType: e.target.value})}
                >
                  <option>Government Office</option>
                  <option>Public Health Center</option>
                  <option>Transit Hub</option>
                  <option>Entertainment Venue</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Daily Footfall</label>
                <div className="relative">
                  <input 
                    type="number" 
                    className={inputClass}
                    value={formData.footfall}
                    onChange={e => setFormData({...formData, footfall: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Number of Counters</label>
                <div className="relative">
                  <input 
                    type="number" 
                    className={inputClass}
                    value={formData.counters}
                    onChange={e => setFormData({...formData, counters: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 shadow-inner">
              <p className="text-xs text-primary font-black mb-3 uppercase tracking-widest">Institutional Policy Notice</p>
              <p className="text-sm text-primary-dark leading-relaxed italic opacity-80">
                "LineLess is a Digital Public Infrastructure. Citizens are never charged for access. Institutions provide the subscription to enable operational efficiency."
              </p>
            </div>

            <button 
              onClick={() => setSubmitted(true)}
              className="w-full bg-primary text-white font-black py-5 rounded-xl hover:bg-primary-dark transition-all shadow-lg active:scale-95 text-sm uppercase tracking-widest"
            >
              Submit Business Enquiry
            </button>
          </div>
        </div>

        {/* Dynamic Estimation Output */}
        <div className="flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-xl font-bold text-primary-dark mb-4">Predicted Impact</h2>
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Wait-Time Reduction</p>
                  <p className="text-2xl font-black text-green-600">{waitReduction}%</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Crowd Reduction</p>
                  <p className="text-2xl font-black text-primary">{crowdReduction}%</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
              </div>

              <div className="bg-accent p-6 rounded-xl border-2 border-accent-bright shadow-xl text-primary-dark">
                <p className="text-xs font-black uppercase opacity-60 tracking-widest">Estimated Monthly Maintenance</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <p className="text-4xl font-black">${costEstimate}</p>
                  <p className="text-sm font-bold opacity-60">/ Month*</p>
                </div>
                <p className="text-[10px] mt-4 font-bold uppercase tracking-tighter">* This is a pre-deployment estimate based on current regional DPI standards.</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-100 rounded-2xl text-sm text-gray-500 border border-gray-200">
            <h4 className="font-black text-gray-700 mb-2 underline uppercase text-xs tracking-widest">Why Institutions choose LineLess?</h4>
            <p className="leading-relaxed">By moving the queue to the digital layer, you reclaim physical square footage, reduce staff stress, and provide a dignified service experience to citizens.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SetupFlow;
