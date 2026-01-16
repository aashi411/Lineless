
import React, { useState } from 'react';
import { apiClient } from '../services/api';

const SetupFlow: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: 'government',
    city: '',
    state: 'Karnataka',
    serviceType: 'Government Office',
    footfall: 500,
    serviceTime: 15,
    counters: 10,
    plan_type: 'basic',
    support_level: 'standard',
    billing_cycle: 'monthly'
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [estimation, setEstimation] = useState<any>(null);
  const [downloadError, setDownloadError] = useState('');

  // Estimates based on form data
  const waitReduction = 75;
  const crowdReduction = 90;
  const monthlyVolume = Math.round(formData.footfall * 22); // 22 working days

  const inputClass = "w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all text-sm font-medium text-primary-dark";
  const selectClass = "w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-accent outline-none transition-all text-sm font-medium text-primary-dark appearance-none cursor-pointer";

  const handleSubmit = async () => {
    if (!formData.organizationName.trim()) {
      alert('Please enter your organization name');
      return;
    }

    setLoading(true);
    setDownloadError('');
    
    try {
      const response = await apiClient.post('/invoices/institutional', {
        organizationName: formData.organizationName,
        organizationType: formData.organizationType,
        plan_type: formData.plan_type,
        service_locations: 1,
        counters_per_location: formData.counters,
        monthly_volume_per_location: monthlyVolume,
        usage_fee_per_transaction: 1.5,
        support_level: formData.support_level,
        billing_cycle: formData.billing_cycle,
        state: formData.state
      });

      if (response.data.success) {
        setEstimation(response.data.estimation);
        setSubmitted(true);
      }
    } catch (error: any) {
      setDownloadError(error.response?.data?.error || 'Failed to generate estimation');
      console.error('Estimation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setLoading(true);
    setDownloadError('');
    
    try {
      const response = await apiClient.post('/invoices/institutional/download', {
        organizationName: formData.organizationName,
        organizationType: formData.organizationType,
        plan_type: formData.plan_type,
        service_locations: 1,
        counters_per_location: formData.counters,
        monthly_volume_per_location: monthlyVolume,
        usage_fee_per_transaction: 1.5,
        support_level: formData.support_level,
        billing_cycle: formData.billing_cycle,
        state: formData.state
      }, { responseType: 'blob' });

      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `LineLess_Estimation_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      setDownloadError('Failed to download PDF. Please try again.');
      console.error('Download error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted && estimation) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-3xl font-bold text-primary-dark mb-2">Estimation Ready!</h1>
            <p className="text-gray-600">Your investment estimate has been calculated and is ready for review and download.</p>
          </div>

          {/* Organization Info Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-primary-dark mb-4 flex items-center">
              <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm mr-3">✓</span>
              Organization Details
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 font-semibold">Organization Name</p>
                <p className="text-primary-dark font-bold">{estimation.organizationName}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold">Type</p>
                <p className="text-primary-dark font-bold">{estimation.organizationType.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold">Plan</p>
                <p className="text-primary-dark font-bold">{estimation.plan_type.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold">State</p>
                <p className="text-primary-dark font-bold">{estimation.state}</p>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border-2 border-primary mb-6 shadow-lg">
            <h2 className="text-lg font-bold text-primary-dark mb-6">Investment Breakdown</h2>
            
            <div className="space-y-4 mb-6">
              {/* Base SaaS */}
              <div className="flex justify-between items-center py-3 border-b border-blue-200">
                <div>
                  <p className="text-gray-600 font-semibold">SaaS Subscription (Monthly)</p>
                  <p className="text-xs text-gray-500">Base platform cost per location</p>
                </div>
                <p className="text-xl font-bold text-primary-dark">₹{estimation.base_saas.toLocaleString('en-IN')}</p>
              </div>

              {/* Usage Fee */}
              <div className="flex justify-between items-center py-3 border-b border-blue-200">
                <div>
                  <p className="text-gray-600 font-semibold">Usage-Based Service Fee</p>
                  <p className="text-xs text-gray-500">{(estimation.monthly_total / 1000).toFixed(0)}k transactions/month @ ₹1.5 each</p>
                </div>
                <p className="text-xl font-bold text-primary-dark">₹{estimation.usage_fee.toLocaleString('en-IN')}</p>
              </div>

              {/* Support */}
              <div className="flex justify-between items-center py-3 border-b border-blue-200">
                <div>
                  <p className="text-gray-600 font-semibold">Support & Maintenance</p>
                  <p className="text-xs text-gray-500">{estimation.support_level.charAt(0).toUpperCase() + estimation.support_level.slice(1)} support level</p>
                </div>
                <p className="text-xl font-bold text-primary-dark">₹{estimation.support_fee.toLocaleString('en-IN')}</p>
              </div>

              {/* Setup Fee */}
              {estimation.setup_fee > 0 && (
                <div className="flex justify-between items-center py-3 border-b border-blue-200">
                  <div>
                    <p className="text-gray-600 font-semibold">Deployment / Setup Fee</p>
                    <p className="text-xs text-gray-500">One-time implementation cost</p>
                  </div>
                  <p className="text-xl font-bold text-primary-dark">₹{estimation.setup_fee.toLocaleString('en-IN')}</p>
                </div>
              )}
            </div>

            {/* Subtotal */}
            <div className="flex justify-between items-center py-4 border-b-2 border-primary mb-4">
              <p className="text-gray-700 font-bold">Subtotal (Before Tax)</p>
              <p className="text-2xl font-bold text-primary-dark">₹{(estimation.subtotal - estimation.gst_amount).toLocaleString('en-IN')}</p>
            </div>

            {/* GST */}
            <div className="flex justify-between items-center py-3 bg-white/50 px-4 rounded-lg mb-4">
              <p className="text-gray-600 font-semibold">{estimation.gst_type} ({estimation.gst_percentage}%)</p>
              <p className="text-lg font-bold text-green-600">+ ₹{estimation.gst_amount.toLocaleString('en-IN')}</p>
            </div>

            {/* Grand Total */}
            <div className="flex justify-between items-center py-4 bg-primary/10 px-4 rounded-lg border-2 border-primary">
              <p className="text-lg font-bold text-primary-dark">GRAND TOTAL</p>
              <p className="text-3xl font-black text-primary">₹{estimation.grand_total.toLocaleString('en-IN')}</p>
            </div>

            {/* Monthly recurring */}
            <p className="text-center text-sm text-gray-600 mt-4">
              <span className="font-semibold">Monthly Recurring Cost:</span> ₹{estimation.monthly_total.toLocaleString('en-IN')}
              {estimation.annual_total && ` | <span class="font-semibold">Annual Cost:</span> ₹${(estimation.annual_total).toLocaleString('en-IN')}`}
            </p>
          </div>

          {/* Configuration Details */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-6">
            <h3 className="font-bold text-primary-dark mb-4">Configuration Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs uppercase font-semibold">Service Locations</p>
                <p className="text-primary-dark font-bold">1</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase font-semibold">Counters per Location</p>
                <p className="text-primary-dark font-bold">{formData.counters}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase font-semibold">Monthly Volume</p>
                <p className="text-primary-dark font-bold">{monthlyVolume.toLocaleString()} transactions</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase font-semibold">Billing Cycle</p>
                <p className="text-primary-dark font-bold">{formData.billing_cycle.charAt(0).toUpperCase() + formData.billing_cycle.slice(1)}</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {downloadError && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {downloadError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleDownloadPDF}
              disabled={loading}
              className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating PDF...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF Estimate
                </>
              )}
            </button>
            <button
              onClick={onComplete}
              className="w-full bg-gray-200 text-primary-dark font-bold py-4 rounded-xl hover:bg-gray-300 transition-all"
            >
              Return to Dashboard
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-xs text-gray-600 text-center">
              <span className="font-bold">Note:</span> This estimate includes the one-time deployment fee. After the first month, your recurring cost will be ₹{estimation.monthly_total.toLocaleString('en-IN')} per month.
            </p>
          </div>
        </div>
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
            Phase 1: Generate Investment Estimate
          </p>

          <div className="space-y-6">
            {/* Organization Name */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Organization Name *</label>
              <input 
                type="text" 
                placeholder="e.g. Municipal Corporation of Delhi"
                className={inputClass}
                value={formData.organizationName}
                onChange={e => setFormData({...formData, organizationName: e.target.value})}
              />
            </div>

            {/* Organization Type */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Organization Type</label>
              <select 
                className={selectClass}
                value={formData.organizationType}
                onChange={e => setFormData({...formData, organizationType: e.target.value})}
              >
                <option value="government">Government</option>
                <option value="private">Private</option>
              </select>
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">State (for GST)</label>
              <input 
                type="text" 
                placeholder="e.g. Karnataka, Tamil Nadu"
                className={inputClass}
                value={formData.state}
                onChange={e => setFormData({...formData, state: e.target.value})}
              />
            </div>

            {/* Service Type */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Service Type</label>
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
            </div>

            {/* Daily Footfall & Counters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Daily Footfall</label>
                <input 
                  type="number" 
                  className={inputClass}
                  value={formData.footfall}
                  onChange={e => setFormData({...formData, footfall: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Number of Counters</label>
                <input 
                  type="number" 
                  className={inputClass}
                  value={formData.counters}
                  onChange={e => setFormData({...formData, counters: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>

            {/* Plan Type */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Service Plan</label>
              <select 
                className={selectClass}
                value={formData.plan_type}
                onChange={e => setFormData({...formData, plan_type: e.target.value})}
              >
                <option value="basic">Basic - ₹20,000/month</option>
                <option value="standard">Standard - ₹50,000/month</option>
                <option value="enterprise">Enterprise - ₹1,50,000/month</option>
              </select>
            </div>

            {/* Support Level */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Support Level</label>
              <select 
                className={selectClass}
                value={formData.support_level}
                onChange={e => setFormData({...formData, support_level: e.target.value})}
              >
                <option value="standard">Standard - ₹5,000/location/month</option>
                <option value="priority">Priority - ₹10,000/location/month</option>
              </select>
            </div>

            {/* Billing Cycle */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billing Cycle</label>
              <select 
                className={selectClass}
                value={formData.billing_cycle}
                onChange={e => setFormData({...formData, billing_cycle: e.target.value})}
              >
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
              </select>
            </div>

            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 shadow-inner">
              <p className="text-xs text-primary font-black mb-3 uppercase tracking-widest">Institutional Policy Notice</p>
              <p className="text-sm text-primary-dark leading-relaxed italic opacity-80">
                "LineLess is a Digital Public Infrastructure. Citizens are never charged for access. Institutions provide the subscription to enable operational efficiency."
              </p>
            </div>

            {downloadError && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {downloadError}
              </div>
            )}

            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-primary text-white font-black py-5 rounded-xl hover:bg-primary-dark transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Calculating Estimate...
                </>
              ) : (
                'Submit Business Enquiry'
              )}
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
                <p className="text-xs font-black uppercase opacity-60 tracking-widest">Estimated Monthly Volume</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <p className="text-4xl font-black">{monthlyVolume.toLocaleString()}</p>
                  <p className="text-sm font-bold opacity-60">Transactions</p>
                </div>
                <p className="text-[10px] mt-4 font-bold uppercase tracking-tighter">* Based on {formData.footfall} daily footfall × 22 working days</p>
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
