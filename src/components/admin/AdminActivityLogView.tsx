import React, { useState, useEffect } from 'react';
import { History, Shield, Clock, Search, RefreshCw } from 'lucide-react';
import { IRepository } from '../../lib/db/repository';
import { ActivityLog } from '../../lib/db/types';
import { formatDateTime } from '../../utils/formatters';

interface AdminActivityLogViewProps {
  repo: IRepository;
}

export const AdminActivityLogView: React.FC<AdminActivityLogViewProps> = ({ repo }) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await repo.getActivityLogs(200);
      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filtered = logs.filter((l) => {
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      return (
        l.action.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.entity.toLowerCase().includes(q) ||
        l.performedBy.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <span>Audit Trail & Activity Log</span>
          </h2>
          <p className="text-xs text-slate-400">
            Append-only record of administrative actions, invoice creations, and payment settlements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-500 w-48"
            />
          </div>

          <button
            onClick={loadLogs}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            title="Refresh logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-3 px-5">Timestamp</th>
                <th className="py-3 px-5">Action</th>
                <th className="py-3 px-5">Entity</th>
                <th className="py-3 px-5">Description</th>
                <th className="py-3 px-5 text-right">Performed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 italic">
                    No activity logs recorded yet.
                  </td>
                </tr>
              ) : (
                filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-5 font-mono text-slate-400">
                      {formatDateTime(l.createdAt)}
                    </td>
                    <td className="py-3.5 px-5 font-mono font-bold text-amber-400">
                      {l.action}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-slate-300">
                        {l.entity}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-200">
                      {l.description}
                    </td>
                    <td className="py-3.5 px-5 text-right font-mono text-slate-400">
                      {l.performedBy}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
