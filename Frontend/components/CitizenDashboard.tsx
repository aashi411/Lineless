
import React, { useState, useEffect } from 'react';
import { ServiceLocation, QueueTicket, TransportMode, PriorityLevel } from '../types';
import { LineLessAPI } from '../services/api';

const MOCK_SERVICES: ServiceLocation[] = [
  { id: '1', name: 'Regional Passport Office', category: 'government', currentQueue: 42, avgWaitMinutes: 120, status: 'OPEN' },
  { id: '2', name: 'Aadhaar Card Center - HQ', category: 'government', currentQueue: 85, avgWaitMinutes: 180, status: 'OPEN' },
  { id: '3', name: 'Metro Rail Smart Cards', category: 'government', currentQueue: 8, avgWaitMinutes: 15, status: 'OPEN' },
  { id: '4', name: 'City Civil Hospital - OPD', category: 'medical', currentQueue: 18, avgWaitMinutes: 45, status: 'OPEN' },
  { id: '5', name: 'Apollo Medical & Pharma', category: 'medical', currentQueue: 3, avgWaitMinutes: 10, status: 'OPEN' },
  { id: '6', name: 'Supermarket Central Mall', category: 'entertainment', currentQueue: 24, avgWaitMinutes: 40, status: 'OPEN' },
  { id: '7', name: 'KFC - City Square', category: 'entertainment', currentQueue: 12, avgWaitMinutes: 20, status: 'OPEN' },
  { id: '8', name: 'Dominos Pizza Outlet', category: 'entertainment', currentQueue: 7, avgWaitMinutes: 25, status: 'OPEN' },
  { id: '9', name: 'Subway - Transit Point', category: 'entertainment', currentQueue: 5, avgWaitMinutes: 12, status: 'OPEN' },
  { id: '10', name: 'IMAX Cinema Hall', category: 'entertainment', currentQueue: 150, avgWaitMinutes: 60, status: 'OPEN' },
];

const CitizenDashboard: React.FC = () => {
  const [activeTicket, setActiveTicket] = useState<QueueTicket | null>(null);
  const [joiningService, setJoiningService] = useState<ServiceLocation | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [distance, setDistance] = useState<number>(2);
  const [mode, setMode] = useState<TransportMode>('TRANSIT');
  const [priority, setPriority] = useState<PriorityLevel>('STANDARD');

  // Computed Predictions
  const [prediction, setPrediction] = useState({ travel: 0, queue: 0, total: 0 });

  useEffect(() => {
    if (joiningService) {
      const p = LineLessAPI.getTotalPrediction(mode, distance, joiningService.avgWaitMinutes);
      setPrediction({ travel: p.travelTime, queue: p.queueWait, total: p.total });
    }
  }, [mode, distance, joiningService]);

  const handleJoinQueue = () => {
    if (!joiningService) return;

    const arrivalTime = new Date(Date.now() + prediction.total * 60000);
    const departureTime = new Date(Date.now() + (prediction.queue - prediction.travel - 5) * 60000);

    // Fix: Added missing 'status' property to satisfy QueueTicket interface
    const ticket: QueueTicket = {
      id: `LN-${Math.floor(Math.random() * 90000 + 10000)}`,
      citizenName: name,
      phone: phone,
      distanceKm: distance,
      locationName: joiningService.name,
      position: joiningService.currentQueue + 1,
      timestamp: new Date().toLocaleTimeString(),
      estimatedArrival: arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      priority: priority,
      transportMode: mode,
      travelTimeMinutes: prediction.travel,
      suggestedDeparture: departureTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'WAITING'
    };
    
    setActiveTicket(ticket);
    setJoiningService(null);
  };

  // Improved UI Classes for Inputs and Selects (White/Yellow Theme)
  const inputContainerClass = "relative bg-white border-4 border-gray-100 rounded-2xl p-1 focus-within:border-accent transition-all shadow-sm";
  const inputClass = "w-full bg-white border-none px-4 py-4 focus:ring-0 outline-none text-base font-bold text-primary-dark placeholder-gray-300";
  const selectClass = "w-full bg-white border-none px-4 py-4 focus:ring-0 outline-none text-base font-black text-primary-dark appearance-none cursor-pointer uppercase tracking-tighter";
  const labelClass = "block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-2";

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in pb-32">
      {joiningService ? (
        <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)]">
          <header className="bg-primary-dark p-8 text-white flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">Queue Protocol Initialized</p>
              <h2 className="text-3xl font-black uppercase tracking-tight">Access Request</h2>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold opacity-60">Service Point</span>
              <p className="text-lg font-black text-accent">{joiningService.name}</p>
            </div>
          </header>

          <div className="p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              {/* Left Column: Data Input */}
              <div className="space-y-8">
                <div>
                  <label className={labelClass}>Citizen Name</label>
                  <div className={inputContainerClass}>
                    <input 
                      type="text"
                      className={inputClass}
                      placeholder="AS PER OFFICIAL ID"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <div className={inputContainerClass}>
                    <input 
                      type="tel"
                      className={inputClass}
                      placeholder="+91 00000 00000"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Distance (km)</label>
                    <div className={inputContainerClass}>
                      <input 
                        type="number"
                        className={inputClass}
                        value={distance}
                        onChange={e => setDistance(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Priority</label>
                    <div className={inputContainerClass}>
                      <select 
                        className={selectClass}
                        value={priority}
                        onChange={e => setPriority(e.target.value as PriorityLevel)}
                      >
                        <option value="STANDARD">General</option>
                        <option value="SENIOR_CITIZEN">Senior</option>
                        <option value="DISABLED">PWD</option>
                        <option value="EMERGENCY">Emergency</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Transport Mode</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['WALK', 'TWO_WHEELER', 'TRANSIT', 'CAR'] as TransportMode[]).map(m => (
                      <button 
                        key={m}
                        onClick={() => setMode(m)}
                        className={`py-4 px-4 rounded-2xl border-4 transition-all text-[11px] font-black uppercase tracking-widest ${
                          mode === m 
                            ? 'border-accent bg-accent text-primary-dark shadow-lg scale-[1.02]' 
                            : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200 hover:bg-white'
                        }`}
                      >
                        {m.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Predictive Block */}
              <div className="bg-gray-50 p-8 rounded-[2rem] border-2 border-gray-100 flex flex-col justify-between">
                <div>
                  <h4 className="text-[12px] font-black text-primary-dark uppercase tracking-[0.3em] mb-8 border-b border-gray-200 pb-4">Live Predictions</h4>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 font-bold">Estimated travel</span>
                      <span className="text-lg font-black text-primary-dark tracking-tighter">{prediction.travel} MINS</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 font-bold">Current queue wait</span>
                      <span className="text-lg font-black text-primary-dark tracking-tighter">{prediction.queue} MINS</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 font-bold">System Buffer</span>
                      <span className="text-lg font-black text-primary-dark tracking-tighter">10 MINS</span>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                   <div className="bg-accent text-primary-dark p-8 rounded-2xl shadow-xl border-4 border-accent-bright text-center relative overflow-hidden">
                     <div className="relative z-10">
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] mb-3 opacity-60">Calculated Arrival</p>
                        <p className="text-5xl font-black tracking-tighter">~{prediction.total}m</p>
                        <div className="mt-4 pt-4 border-t border-primary-dark/10 flex justify-center gap-2 items-center">
                           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                           <span className="text-sm font-black uppercase">{new Date(Date.now() + prediction.total * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                     </div>
                   </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <button 
                onClick={handleJoinQueue}
                disabled={!name || !phone}
                className={`w-full py-6 rounded-[1.5rem] font-black text-lg uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 ${
                  (!name || !phone) 
                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                    : 'bg-primary-dark text-white hover:bg-primary'
                }`}
              >
                Join Secure Queue
              </button>
              <button 
                onClick={() => setJoiningService(null)}
                className="w-full text-[11px] font-black text-gray-400 hover:text-red-600 uppercase tracking-widest py-2 transition-colors"
              >
                Abort Access Request
              </button>
            </div>
          </div>
        </div>
      ) : activeTicket ? (
        <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] animate-fade-in">
          <div className="bg-primary-dark p-8 text-white flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">DPI Secure Token</p>
              <h2 className="text-7xl font-black leading-none tracking-tighter">{activeTicket.id}</h2>
            </div>
            <div className="text-right">
              <span className="bg-accent text-primary-dark px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg">Valid Token</span>
            </div>
          </div>

          <div className="p-10">
            <div className="mb-10 border-b border-gray-100 pb-8 flex justify-between items-start">
              <div>
                <h3 className="text-3xl font-black text-primary-dark tracking-tight">{activeTicket.locationName}</h3>
                <p className="text-sm text-gray-400 mt-2 font-medium">Holder: <span className="font-bold text-primary-dark">{activeTicket.citizenName}</span></p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                 <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Queue Position</p>
                 <p className="text-2xl font-black text-primary-dark">#{activeTicket.position}</p>
              </div>
            </div>

            {/* Smart Journey Guidance */}
            <div className="bg-gray-50 rounded-[2rem] p-8 border-2 border-gray-100 mb-10">
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Orchestrated Arrival Plan</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-2">
                    <span className="text-gray-500 font-bold uppercase text-[10px]">Queue Wait</span>
                    <span className="font-black text-primary-dark">~{activeTicket.position * 4} MINS</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-2">
                    <span className="text-gray-500 font-bold uppercase text-[10px]">Transit ({activeTicket.transportMode})</span>
                    <span className="font-black text-primary-dark">~{activeTicket.travelTimeMinutes} MINS</span>
                  </div>
                  <div className="pt-4 flex justify-between items-center">
                    <span className="text-primary font-black uppercase text-[12px] tracking-widest">Target Departure</span>
                    <span className="text-4xl font-black text-primary-dark tracking-tighter">{activeTicket.suggestedDeparture}</span>
                  </div>
                </div>

                <div className="bg-accent text-primary-dark p-6 rounded-2xl shadow-lg border-2 border-accent-bright">
                  <p className="text-[11px] font-black uppercase mb-3 opacity-60 tracking-[0.2em]">Mandatory Instruction</p>
                  <p className="text-base font-bold leading-relaxed">Do not approach the facility before your turn. Stay at your current location and leave at <span className="font-black underline">{activeTicket.suggestedDeparture}</span>.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-100 text-center">
                <p className="text-[11px] text-primary font-black uppercase mb-2 tracking-widest">Est. Service Start</p>
                <p className="text-4xl font-black text-primary-dark tracking-tighter">{activeTicket.estimatedArrival}</p>
              </div>
              <div className="bg-primary-dark p-6 rounded-2xl text-center text-white flex flex-col justify-center">
                <p className="text-[11px] text-accent font-black uppercase mb-2 tracking-widest">Platform State</p>
                <p className="text-2xl font-black leading-tight uppercase tracking-widest">Nominal</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-center gap-10">
             <button className="text-[11px] font-black text-gray-400 hover:text-primary tracking-[0.2em] uppercase transition-colors">Download DPI Pass</button>
             <button className="text-[11px] font-black text-red-600 hover:text-red-800 tracking-[0.2em] uppercase transition-colors" onClick={() => setActiveTicket(null)}>Relinquish Token</button>
          </div>
        </div>
      ) : (
        <>
          <header className="mb-16 text-center">
             <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Infrastructure Access</p>
            <h1 className="text-5xl lg:text-6xl font-black text-primary-dark tracking-tighter">Public Access Gateway</h1>
            <p className="text-lg text-gray-500 mt-4 max-w-xl mx-auto font-medium">Secure your position in high-load public and commercial services without physical presence.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_SERVICES.map(service => (
              <div 
                key={service.id}
                className="bg-white p-8 rounded-[2rem] border border-gray-100 flex flex-col justify-between hover:border-primary hover:shadow-xl group transition-all"
              >
                <div className="mb-8">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase text-primary tracking-[0.3em] bg-blue-50 px-3 py-1 rounded-full">{service.category}</span>
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> {service.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-primary-dark group-hover:text-primary transition-colors">{service.name}</h3>
                  <div className="flex gap-6 mt-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Avg Wait</span>
                      <span className="text-lg font-black text-primary-dark">{service.avgWaitMinutes}m</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">In Queue</span>
                      <span className="text-lg font-black text-primary-dark">{service.currentQueue}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setJoiningService(service)}
                  className="w-full bg-accent hover:bg-accent-bright text-primary-dark font-black py-5 rounded-2xl text-[12px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all"
                >
                  Join Secure Queue
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CitizenDashboard;
