import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Save, Phone, Mail, Bell, CheckCircle2 } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useAdmin();
  const [formData, setFormData] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
        <div>
          <h3 className="text-base font-bold text-white">Operations & Communication Settings</h3>
          <p className="text-xs text-slate-400">
            Configure customer hotlines, operational email addresses, and announcement banner messages.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Hotlines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                Primary Hotline (Procurement)
              </label>
              <input
                type="text"
                required
                value={formData.primaryHotline}
                onChange={e => setFormData({ ...formData, primaryHotline: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                Secondary Hotline (Logistics)
              </label>
              <input
                type="text"
                required
                value={formData.secondaryHotline}
                onChange={e => setFormData({ ...formData, secondaryHotline: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Emails */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Official Business Email
              </label>
              <input
                type="email"
                required
                value={formData.officialEmail}
                onChange={e => setFormData({ ...formData, officialEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Order Notification Recipient
              </label>
              <input
                type="email"
                required
                value={formData.adminNotificationEmail}
                onChange={e => setFormData({ ...formData, adminNotificationEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Announcement text */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              Top Announcement Bar Message
            </label>
            <input
              type="text"
              value={formData.announcementText}
              onChange={e => setFormData({ ...formData, announcementText: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save System Settings</span>
            </button>
            {saved && (
              <span className="ml-3 text-emerald-400 font-semibold inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Settings saved successfully!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
