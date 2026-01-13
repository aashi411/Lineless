
import React, { useState, useEffect } from 'react';
import { CounterState, OperatorSession, QueueTicket, TicketStatus } from '../types';

const INITIAL_COUNTERS: CounterState[] = [
  { id: 'C-01', operatorName: 'Officer Rao', status: 'SERVING', avgServiceTime: 4.2, healthScore: 92 },
  { id: 'C-02', operatorName: 'Officer Khan', status: 'IDLE', avgServiceTime: 5.0, healthScore: 85 },
  { id: 'C-03', operatorName: 'Officer Gupta', status: 'BREAK', avgServiceTime: 3.8, healthScore: 78 },
];

const MOCK_QUEUE: QueueTicket[] = [
  { id: 'LN-102', citizenName: 'Amit Sharma', phone: '+91 99999 00001', priority: 'EMERGENCY', transportMode: 'CAR', distanceKm: 1.2, estimatedArrival: '14:30', timestamp: '14:15', status: 'WAITING', position: 1, locationName: 'HQ' },
  { id: 'LN-103', citizenName: 'Sara Jones', phone: '+91 99999 00002', priority: 'SENIOR_CITIZEN', transportMode: 'WALK', distanceKm: 0.5, estimatedArrival: '14:45', timestamp: '14:20', status: 'WAITING', position: 2, locationName: 'HQ' },
  { id: 'LN-104', citizenName: 'Raj Patel', phone: '+91 99999 00003', priority: 'STANDARD', transportMode: 'TRANSIT', distanceKm: 4.5, estimatedArrival: '15:00', timestamp: '14:25', status: 'WAITING', position: 3, locationName: 'HQ' },
  { id: 'LN-105', citizenName: 'Vikram Singh', phone: '+91 99999 00004', priority: 'DISABLED', transportMode: 'TWO_WHEELER', distanceKm: 2.1, estimatedArrival: '15:10', timestamp: '14:30', status: 'WAITING', position: 4, locationName: 'HQ' },
  { id: 'LN-106', citizenName: 'Elena Gilbert', phone: '+91 99999 00005', priority: 'STANDARD', transportMode: 'CAR', distanceKm: 8.0, estimatedArrival: '15:30', timestamp: '14:35', status: 'WAITING', position: 5, locationName: 'HQ' },
];

interface OperatorDashboardProps {
  session: OperatorSession;
  onLogout: () => void;
}

const OperatorDashboard: React.FC<OperatorDashboardProps> = ({ session, onLogout }) => {
  const [counters, setCounters] = useState(INITIAL_COUNTERS);
  const [queue, setQueue] = useState<QueueTicket[]>(MOCK_QUEUE);
  const [queueStatus, setQueueStatus] = useState<'ACTIVE' | 'PAUSED' | 'EMERGENCY'>('ACTIVE');
  const [showQueueSidebar, setShowQueueSidebar] = useState(false);

  const handleServeNext = () => {
    setQueue(prev => {
      const nextWaitingIndex = prev.findIndex(t => t.status === 'WAITING');
      if (nextWaitingIndex === -1) return prev;

      const newQueue = [...prev];
      // Mark current serving as served if any
      newQueue.forEach(t => { if (t.status === 'SERVING') t.status = 'SERVED'; });
      // Set new one to serving
      newQueue[nextWaitingIndex].status = 'SERVING';
      
      // Update positions
      let pos = 1;
      return newQueue.map(t => {
        if (t.status === 'WAITING') {
          return { ...t, position: pos++ };
        }
        return { ...t, position: 0 };
      });
    });
  };

  const toggleQueue = () => setQueueStatus(prev => prev === 'ACTIVE' ? 'PAUSED' : 'ACTIVE');
  const toggleEmergency = () => setQueueStatus(prev => prev === 'EMERGENCY' ? 'ACTIVE' : 'EMERGENCY');
  const lockCounter = (id: string) => {
    setCounters(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'LOCKED' ? 'IDLE' : 'LOCKED' } : c));
  };

  const getPriorityBadge = (p: string) => {
    switch(p) {
      case 'EMERGENCY': return 'bg-red-100 text-red-700 border-red-200';
      case 'SENIOR_CITIZEN': return 'bg-accent/20 text-primary-dark border-accent/40';
      case 'DISABLED': return 'bg-blue-100 text-primary border-blue-200';
      default: return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col animate-fade-in ${queueStatus === 'EMERGENCY' ? 'bg-red-50' : 'bg-gray-50'}`}>
      
      {/* DPI Operational Header */}
      <div className={`p-4 flex flex-col sm:flex-row justify-between items-center border-b sticky top-0 z-50 transition-colors ${
        queueStatus === 'EMERGENCY' ? 'bg-red-600 border-red-700 text-white' : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
          <button onClick={onLogout} className="w-10 h-10 bg-primary-dark/10 rounded-xl flex items-center justify-center hover:bg-accent/20 transition-colors">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg font-black uppercase tracking-tighter leading-none">{session.institutionName}</h1>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50">DPI Command Node: OPD-14</p>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={handleServeNext} className="flex-grow sm:flex-none bg-accent hover:bg-accent-bright text-primary-dark font-black px-6 py-2.5 rounded-xl text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
            Serve Next Entry
          </button>
          <button onClick={toggleQueue} className="px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all">
            {queueStatus === 'ACTIVE' ? 'Pause' : 'Resume'}
          </button>
          <button onClick={toggleEmergency} className={`px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
            queueStatus === 'EMERGENCY' ? 'bg-white text-red-600' : 'bg-red-600 text-white'
          }`}>
            Emergency
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col lg:flex-row">
        {/* Main Operational Panel */}
        <div className="flex-grow p-4 sm:p-10 overflow-y-auto pb-32">
          
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">In-Queue</p>
              <p className="text-4xl font-black text-primary-dark">{queue.filter(t => t.status === 'WAITING').length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Seniors / Disabled</p>
              <p className="text-4xl font-black text-primary-dark">{queue.filter(t => t.priority === 'SENIOR_CITIZEN' || t.priority === 'DISABLED').length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Emergencies</p>
              <p className="text-4xl font-black text-red-600">{queue.filter(t => t.priority === 'EMERGENCY').length}</p>
            </div>
            <div className="bg-primary-dark p-6 rounded-2xl text-white shadow-xl">
              <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-2">Flow Rate</p>
              <p className="text-4xl font-black tracking-tighter">14/hr</p>
              <p className="text-[9px] font-bold opacity-60 uppercase mt-2">Optimal System Health</p>
            </div>
          </div>

          {/* Active Infrastructure Counters */}
          <div className="mb-12">
            <h3 className="text-sm font-black text-primary-dark uppercase tracking-[0.2em] mb-6">Active Counter Infrastructure</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {counters.map(c => (
                <div key={c.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex justify-between items-center">
                  <div>
                    <p className="text-xl font-black text-primary-dark">{c.id}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{c.operatorName}</p>
                  </div>
                  <button onClick={() => lockCounter(c.id)} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                    c.status === 'LOCKED' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-50 text-gray-400'
                  }`}>
                    {c.status}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* NEW: LIVE QUEUE TABLE (ROW-WISE) */}
          <div className="bg-white rounded-[2rem] border border-gray-200 shadow-xl overflow-hidden mb-12">
            <div className="bg-gray-50 p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-sm font-black text-primary-dark uppercase tracking-[0.2em]">Live Service Stream</h3>
              <div className="flex gap-4">
                 <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase">
                   <span className="w-2 h-2 bg-green-500 rounded-full"></span> Waiting
                 </span>
                 <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase">
                   <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span> Serving
                 </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px] md:min-w-full">
                <thead className="bg-primary-dark text-white text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-5">Pos</th>
                    <th className="px-6 py-5">Identifier</th>
                    <th className="px-6 py-5">Category</th>
                    <th className="px-6 py-5">Mode / Dist</th>
                    <th className="px-6 py-5">Est. Wait</th>
                    <th className="px-6 py-5">Joined At</th>
                    <th className="px-6 py-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {queue.map((ticket) => (
                    <tr key={ticket.id} className={`transition-colors group hover:bg-gray-50 ${
                      ticket.status === 'SERVING' ? 'bg-accent/5' : ''
                    } ${ticket.priority === 'EMERGENCY' ? 'border-l-4 border-red-500' : ''}`}>
                      <td className="px-6 py-5">
                        <span className="text-sm font-black text-primary-dark">
                          {ticket.status === 'WAITING' ? `#${ticket.position}` : '—'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-primary-dark">{ticket.citizenName}</p>
                        <p className="text-[10px] font-black text-gray-400 tracking-widest">{ticket.id}</p>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getPriorityBadge(ticket.priority)}`}>
                          {ticket.priority.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-xs font-bold text-primary-dark uppercase tracking-tighter">{ticket.transportMode}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{ticket.distanceKm} km</p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-black text-primary-dark">{ticket.status === 'SERVED' ? 'Complete' : `~${ticket.estimatedArrival}`}</p>
                      </td>
                      <td className="px-6 py-5 text-xs text-gray-400 font-medium">
                        {ticket.timestamp}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          ticket.status === 'WAITING' ? 'bg-gray-100 text-gray-400' :
                          ticket.status === 'SERVING' ? 'bg-accent text-primary-dark shadow-sm' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {ticket.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Mobile-Only Condensed View Hint */}
            <div className="md:hidden p-4 bg-gray-50 border-t border-gray-100 text-center">
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Swipe horizontally to view full infrastructure metrics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorDashboard;
