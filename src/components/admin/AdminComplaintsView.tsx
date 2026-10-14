import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Send, 
  X, 
  ChevronRight, 
  Paperclip,
  Tag
} from 'lucide-react';
import { IRepository } from '../../lib/db/repository';
import { Complaint, ComplaintMessage, Client, Invoice, Delivery } from '../../lib/db/types';
import { formatDateTime, formatDate } from '../../utils/formatters';

interface AdminComplaintsViewProps {
  repo: IRepository;
}

export const AdminComplaintsView: React.FC<AdminComplaintsViewProps> = ({ repo }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Thread Modal
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);
  const [replyText, setReplyText] = useState('');

  // New Ticket Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState<Partial<Complaint>>({
    category: 'quality',
    priority: 'medium',
    status: 'open',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [cList, clientList] = await Promise.all([
        repo.getComplaints(),
        repo.getClients(),
      ]);
      setComplaints(cList);
      setClients(clientList);

      if (activeComplaint) {
        const refreshed = cList.find((c) => c.id === activeComplaint.id);
        if (refreshed) setActiveComplaint(refreshed);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaint || !replyText.trim()) return;

    try {
      await repo.addComplaintMessage(activeComplaint.id, {
        senderRole: 'admin',
        senderName: 'Super Admin / Ali Food Desk',
        message: replyText.trim(),
      });
      setReplyText('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to send reply');
    }
  };

  const handleStatusChange = async (id: string, status: Complaint['status']) => {
    try {
      await repo.updateComplaintStatus(id, status);
      loadData();
    } catch (err: any) {
      alert('Failed to update status');
    }
  };

  const handlePriorityChange = async (id: string, priority: Complaint['priority']) => {
    try {
      if (activeComplaint) {
        await repo.updateComplaintStatus(id, activeComplaint.status, priority);
        loadData();
      }
    } catch (err: any) {
      alert('Failed to update priority');
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.clientId || !newTicket.subject) return;

    try {
      await repo.saveComplaint(newTicket);
      setIsNewModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create complaint ticket');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <span>Client Inquiries & Quality Tickets</span>
          </h2>
          <p className="text-xs text-slate-400">
            Address delivery delays, portioning feedback, invoice queries, and customer satisfaction tickets.
          </p>
        </div>

        <button
          onClick={() => {
            setNewTicket({
              category: 'quality',
              priority: 'medium',
              status: 'open',
            });
            setIsNewModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow"
        >
          <Plus className="w-4 h-4" />
          <span>+ Log Ticket</span>
        </button>
      </div>

      {/* Kanban / Status Columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(['open', 'in_progress', 'resolved', 'closed'] as const).map((status) => {
          const colComplaints = complaints.filter((c) => c.status === status);
          const colColor: Record<string, string> = {
            open: 'border-amber-500/50 text-amber-400',
            in_progress: 'border-blue-500/50 text-blue-400',
            resolved: 'border-emerald-500/50 text-emerald-400',
            closed: 'border-slate-700 text-slate-400',
          };

          return (
            <div key={status} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${colColor[status]}`}>
                  <span className="w-2 h-2 rounded-full bg-current" />
                  <span>{status.replace('_', ' ')}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-300 font-bold">
                  {colComplaints.length}
                </span>
              </div>

              <div className="space-y-2.5 overflow-y-auto max-h-[65vh] flex-1">
                {colComplaints.length === 0 ? (
                  <p className="text-[11px] text-slate-500 italic py-6 text-center">No tickets in {status.replace('_', ' ')}</p>
                ) : (
                  colComplaints.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setActiveComplaint(c)}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all space-y-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-amber-400">{c.complaintNumber}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                          c.priority === 'urgent' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {c.priority}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                        {c.subject}
                      </h4>

                      <div className="text-[11px] text-slate-400 truncate">
                        {c.clientCompany || c.clientName}
                      </div>

                      <div className="pt-1 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
                        <span className="capitalize">{c.category}</span>
                        <span>{c.messages?.length || 0} msgs</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* COMPLAINT THREAD & CHAT MODAL */}
      {activeComplaint && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl text-white">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                    {activeComplaint.complaintNumber}
                  </span>
                  <h3 className="text-base font-bold text-white">{activeComplaint.subject}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Client: <strong>{activeComplaint.clientCompany || activeComplaint.clientName}</strong> • Category: <span className="capitalize">{activeComplaint.category}</span>
                </p>
              </div>

              <button onClick={() => setActiveComplaint(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status & Priority Controller Strip */}
            <div className="px-5 py-2.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Status:</span>
                <select
                  value={activeComplaint.status}
                  onChange={(e) => handleStatusChange(activeComplaint.id, e.target.value as any)}
                  className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white font-bold uppercase text-[11px]"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Priority:</span>
                <select
                  value={activeComplaint.priority}
                  onChange={(e) => handlePriorityChange(activeComplaint.id, e.target.value as any)}
                  className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white font-bold uppercase text-[11px]"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Message Thread History */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {(activeComplaint.messages || []).length === 0 ? (
                <p className="text-slate-500 text-center py-8">No messages in this ticket yet. Write the first response below.</p>
              ) : (
                (activeComplaint.messages || []).map((m) => {
                  const isAdmin = m.senderRole === 'admin';
                  return (
                    <div key={m.id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1">
                        <span className="font-bold text-slate-300">{m.senderName}</span>
                        <span>•</span>
                        <span>{formatDateTime(m.createdAt)}</span>
                      </div>
                      <div
                        className={`p-3 rounded-2xl max-w-lg text-xs leading-relaxed ${
                          isAdmin
                            ? 'bg-amber-500 text-slate-950 font-medium rounded-br-none'
                            : 'bg-slate-800 text-slate-100 rounded-bl-none'
                        }`}
                      >
                        {m.message}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleSendReply} className="p-4 border-t border-slate-800 bg-slate-950 flex gap-2">
              <input
                type="text"
                placeholder="Type response to client..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Reply</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW TICKET MODAL */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold">Log Client Quality / Inquiries Ticket</h3>
              <button onClick={() => setIsNewModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Select Client *</label>
                <select
                  required
                  value={newTicket.clientId || ''}
                  onChange={(e) => setNewTicket({ ...newTicket, clientId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm"
                >
                  <option value="">-- Choose Client --</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Issue Category</label>
                  <select
                    value={newTicket.category || 'quality'}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm"
                  >
                    <option value="quality">Quality / Portioning</option>
                    <option value="quantity">Quantity Discrepancy</option>
                    <option value="late">Late Delivery</option>
                    <option value="billing">Billing Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Priority Level</label>
                  <select
                    value={newTicket.priority || 'medium'}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Skinless breast cut thickness feedback"
                  value={newTicket.subject || ''}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase"
                >
                  Open Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
