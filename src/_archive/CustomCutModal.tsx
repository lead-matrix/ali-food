import React, { useState } from 'react';
import { X, Scissors, Send, Phone, MessageSquare, CheckCircle } from 'lucide-react';
import { CustomCutInquiry } from '../../types';
import { createCustomCutWhatsApp } from '../../utils/whatsapp';

interface CustomCutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomCutModal: React.FC<CustomCutModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<Partial<CustomCutInquiry>>({
    name: '',
    company: '',
    phone: '',
    email: '',
    birdType: 'Broiler Chicken',
    cutSpecification: 'Boneless Breast Fillet, 150g Calibrated',
    skinPreference: 'Skinless',
    bonePreference: 'Boneless',
    packagingPreference: 'Vacuum Sealed in 2.5kg Packs',
    estimatedVolumeKg: 50,
    frequency: 'Daily',
    deliveryCity: 'Dhaka',
    deliveryAddress: '',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleWhatsAppRedirect = () => {
    const inquiry: CustomCutInquiry = {
      id: `cut-${Date.now()}`,
      name: formData.name || 'Anonymous',
      company: formData.company || 'Wholesale Client',
      phone: formData.phone || 'N/A',
      email: formData.email || '',
      birdType: formData.birdType || 'Poultry',
      cutSpecification: formData.cutSpecification || '',
      skinPreference: formData.skinPreference || 'Skinless',
      bonePreference: formData.bonePreference || 'Boneless',
      packagingPreference: formData.packagingPreference || '',
      estimatedVolumeKg: Number(formData.estimatedVolumeKg) || 20,
      frequency: (formData.frequency as any) || 'Daily',
      deliveryCity: (formData.deliveryCity as any) || 'Dhaka',
      deliveryAddress: formData.deliveryAddress || '',
      notes: formData.notes || '',
      createdAt: new Date().toISOString()
    };

    const url = createCustomCutWhatsApp(inquiry);
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-white my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">
                Request Custom Culinary Portioning
              </h3>
              <p className="text-xs text-slate-400">
                Institutional butcher portioning & customized weight specifications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-white">
                Custom Processing Request Prepared!
              </h4>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Your culinary cut specifications have been formatted. Connect directly with the Ali Food Butchery Supervisor via WhatsApp for instant review.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleWhatsAppRedirect}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide shadow-lg"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Cut Spec on WhatsApp</span>
                </button>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Contact & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Chef / Purchasing Manager"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Company / Restaurant Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grand Bistro, Central Kitchen"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Row 2: Phone & Delivery City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Direct Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Delivery Logistics Hub *
                  </label>
                  <select
                    value={formData.deliveryCity}
                    onChange={e => setFormData({ ...formData, deliveryCity: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="Dhaka">Dhaka Central Processing Division (Tejgaon)</option>
                    <option value="Chattogram">Chattogram Regional Division (West Madarbari)</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Bird Type & Cut Specification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Bird / Product Base *
                  </label>
                  <select
                    value={formData.birdType}
                    onChange={e => setFormData({ ...formData, birdType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="Broiler Chicken">Broiler Chicken</option>
                    <option value="Sonalika Chicken">Sonalika Chicken</option>
                    <option value="Desi / Country Chicken">Desi Country Chicken</option>
                    <option value="Duck / Waterfowl">Duck / Waterfowl</option>
                    <option value="Layer Chicken">Layer Chicken</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cut Type & Weight Specification *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 150g Breast Fillets, 4-way Curry Cut"
                    value={formData.cutSpecification}
                    onChange={e => setFormData({ ...formData, cutSpecification: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Row 4: Skin & Bone Preferences */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Skin Preference
                  </label>
                  <div className="flex gap-2">
                    {['Skinless', 'Skin-on', 'Either'].map(opt => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setFormData({ ...formData, skinPreference: opt as any })}
                        className={`flex-1 py-1.5 text-xs rounded-lg border ${
                          formData.skinPreference === opt
                            ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Bone Preference
                  </label>
                  <div className="flex gap-2">
                    {['Boneless', 'Bone-in', 'Either'].map(opt => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setFormData({ ...formData, bonePreference: opt as any })}
                        className={`flex-1 py-1.5 text-xs rounded-lg border ${
                          formData.bonePreference === opt
                            ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 5: Volume, Frequency, Packaging */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Batch Volume (Kg)
                  </label>
                  <input
                    type="number"
                    min="10"
                    step="5"
                    value={formData.estimatedVolumeKg}
                    onChange={e => setFormData({ ...formData, estimatedVolumeKg: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Supply Schedule
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={e => setFormData({ ...formData, frequency: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="Daily">Daily Scheduled Delivery</option>
                    <option value="Weekly">Weekly (2-3 times)</option>
                    <option value="Bi-weekly">Bi-weekly</option>
                    <option value="One-time">One-time Event / Banquet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Packaging Type
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vacuum 2kg bags"
                    value={formData.packagingPreference}
                    onChange={e => setFormData({ ...formData, packagingPreference: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Special Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Additional Portioning or Recipe Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Detail any specific trimming, wing-jointing, descaling, or delivery hour constraints..."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wide shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Custom Cut Request</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
