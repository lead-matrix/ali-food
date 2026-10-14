import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  MapPin, 
  FileText, 
  CreditCard, 
  Truck, 
  MessageSquare, 
  Edit, 
  Trash2, 
  RotateCcw, 
  ExternalLink, 
  Key, 
  ShieldCheck, 
  Download, 
  X, 
  Check, 
  AlertCircle,
  Eye
} from 'lucide-react';
import { IRepository } from '../../lib/db/repository';
import { Client, Delivery, Invoice, Payment } from '../../lib/db/types';
import { formatBDT, formatDate } from '../../utils/formatters';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface AdminClientsViewProps {
  repo: IRepository;
  initialSelectedClientId?: string | null;
  onViewAsClient?: (clientId: string) => void;
}

export const AdminClientsView: React.FC<AdminClientsViewProps> = ({
  repo,
  initialSelectedClientId,
  onViewAsClient,
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDueOnly, setFilterDueOnly] = useState(false);
  const [includeDeactivated, setIncludeDeactivated] = useState(false);

  // Client modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);

  // Ledger drilldown modal
  const [ledgerClient, setLedgerClient] = useState<Client | null>(null);
  const [ledgerData, setLedgerData] = useState<{
    deliveries: Delivery[];
    invoices: Invoice[];
    payments: Payment[];
    runningBalance: number;
    totalBilled: number;
    totalPaid: number;
  } | null>(null);

  // Cloud credential modal
  const [cloudCredModal, setCloudCredModal] = useState<{
    client: Client;
    tempPass: string;
    email: string;
  } | null>(null);

  const loadClients = async () => {
    setLoading(true);
    try {
      const list = await repo.getClients(includeDeactivated);
      setClients(list);

      if (initialSelectedClientId) {
        const found = list.find((c) => c.id === initialSelectedClientId);
        if (found) {
          openLedger(found);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, [includeDeactivated]);

  const openLedger = async (client: Client) => {
    setLedgerClient(client);
    try {
      const data = await repo.getClientLedger(client.id);
      setLedgerData(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient || !editingClient.company) return;

    try {
      await repo.saveClient(editingClient);
      setIsEditModalOpen(false);
      setEditingClient(null);
      loadClients();
    } catch (err: any) {
      alert(err.message || 'Failed to save client');
    }
  };

  const handleToggleDeactivate = async (client: Client) => {
    if (client.active) {
      if (confirm(`Deactivate client ${client.company}? They will be hidden from new dispatches.`)) {
        await repo.saveClient({ id: client.id, active: false });
        loadClients();
      }
    } else {
      await repo.saveClient({ id: client.id, active: true });
      loadClients();
    }
  };

  const handleCreateCloudLogin = async (client: Client) => {
    if (!isSupabaseConfigured || !supabase) {
      alert('Cloud mode is not configured yet. Configure Supabase in .env to enable multi-device client logins. Meanwhile, you can share statements via PDF or WhatsApp directly!');
      return;
    }

    const email = client.email || `${client.code.toLowerCase().replace(/[^a-z0-9]/g, '')}@alifoodbd.com`;
    const tempPass = `AF${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      // 1. Sign up user in Supabase auth
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email,
        password: tempPass,
      });

      if (authErr) throw authErr;
      if (authData.user) {
        // 2. Set profile role='client' and client_id
        await supabase.from('profiles').upsert({
          id: authData.user.id,
          role: 'client',
          client_id: client.id,
          full_name: client.contactName,
          phone: client.phone,
          email,
        });
      }

      setCloudCredModal({ client, email, tempPass });
    } catch (err: any) {
      alert(err.message || 'Failed to create cloud user');
    }
  };

  const handleSendStatementWhatsApp = (client: Client, balance: number) => {
    const text = `*M/S ALI FOOD - ACCOUNT STATEMENT NOTICE*
Client: *${client.company}* (Code: ${client.code})
Proprietor: AL ISLAM RIDHOY
Settlement Terms: ${client.creditTerms.toUpperCase()} Settlement

*Current Outstanding Balance: ${formatBDT(balance)}*

Please arrange settlement to:
- Dutch-Bangla Bank PLC | A/C: M/S Ali Food | 123.110.456789
- bKash Merchant: 01319-345501
- Inquiries: 01319-345501 / 01401-238019

_Thank you for your valued institutional partnership with M/S Ali Food._`;

    const phone = (client.whatsapp || client.phone).replace(/[^0-9]/g, '');
    const formattedPhone = phone.startsWith('88') ? phone : `88${phone}`;
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleDownloadLedgerPDF = (client: Client, data: any) => {
    const doc = new jsPDF();
    doc.setFillColor(28, 8, 8);
    doc.rect(0, 0, 210, 32, 'F');

    doc.setTextColor(245, 166, 35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('M/S ALI FOOD - ACCOUNT STATEMENT LEDGER', 14, 14);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`Commercial Client: ${client.company} (${client.code}) | Credit Terms: ${client.creditTerms.toUpperCase()}`, 14, 21);
    doc.text(`Generated on: ${formatDate(new Date())}`, 14, 27);

    let y = 42;
    doc.setTextColor(20, 20, 20);
    doc.setFontSize(9);
    doc.text(`Opening Balance: ${formatBDT(client.openingBalance)}`, 14, y);
    doc.text(`Total Billed: ${formatBDT(data.totalBilled)}`, 70, y);
    doc.text(`Total Paid: ${formatBDT(data.totalPaid)}`, 130, y);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 38);
    doc.text(`Net Outstanding Balance: ${formatBDT(data.runningBalance)}`, 14, y + 7);

    // Invoices table
    const invRows = data.invoices.map((inv: Invoice) => [
      inv.invoiceNumber,
      formatDate(inv.issueDate),
      formatDate(inv.dueDate),
      formatBDT(inv.total),
      formatBDT(inv.paidAmount),
      formatBDT(inv.dueAmount),
      inv.status.toUpperCase(),
    ]);

    autoTable(doc, {
      startY: y + 14,
      head: [['Invoice #', 'Issue Date', 'Due Date', 'Total', 'Paid', 'Due', 'Status']],
      body: invRows,
      theme: 'grid',
      headStyles: { fillColor: [28, 8, 8], textColor: [245, 166, 35], fontSize: 8 },
      styles: { fontSize: 8 },
    });

    doc.save(`${client.code}_Statement_Ledger.pdf`);
  };

  const filteredClients = clients.filter((c) => {
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      const matchComp = c.company.toLowerCase().includes(q);
      const matchName = c.contactName.toLowerCase().includes(q);
      const matchPhone = c.phone.includes(q);
      const matchCode = c.code.toLowerCase().includes(q);
      if (!matchComp && !matchName && !matchPhone && !matchCode) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Search Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <span>Commercial Client Directory ({clients.length})</span>
          </h2>
          <p className="text-xs text-slate-400">
            Supermarket chains, catering houses, HoReCa, and institutional buyers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search client, phone, code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 w-48 sm:w-64"
            />
          </div>

          <button
            onClick={() => {
              setEditingClient({
                customerType: 'Restaurant',
                creditTerms: 'weekly',
                city: 'Dhaka',
                openingBalance: 0,
                active: true,
              });
              setIsEditModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Client</span>
          </button>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-3 px-5">Code</th>
                <th className="py-3 px-5">Company & Contact</th>
                <th className="py-3 px-5">Location & Hub</th>
                <th className="py-3 px-5">Category & Terms</th>
                <th className="py-3 px-5 text-center">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-bold text-amber-400">
                    {client.code}
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="font-bold text-white text-sm">{client.company}</div>
                    <div className="text-slate-400 text-[11px] flex items-center gap-2 mt-0.5">
                      <span>{client.contactName}</span>
                      <span>•</span>
                      <a href={`tel:${client.phone}`} className="font-mono hover:text-amber-300">
                        {client.phone}
                      </a>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-slate-300">
                    <div>{client.city} Division</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">{client.address}</div>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200 uppercase">
                      {client.customerType}
                    </span>
                    <div className="text-[11px] text-slate-400 mt-0.5 capitalize">
                      Terms: <strong className="text-amber-400">{client.creditTerms}</strong>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      client.active ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {client.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openLedger(client)}
                        className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors"
                        title="View Complete Ledger & Send Statement"
                      >
                        <FileText className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setEditingClient(client);
                          setIsEditModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Edit Client"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {onViewAsClient && (
                        <button
                          onClick={() => onViewAsClient(client.id)}
                          className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                          title="View Portal as this Client (Impersonate)"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CLIENT LEDGER & STATEMENT MODAL */}
      {ledgerClient && ledgerData && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl text-white">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold">
                    {ledgerClient.code}
                  </span>
                  <h3 className="text-lg font-bold text-white">{ledgerClient.company}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Contact: {ledgerClient.contactName} • {ledgerClient.phone} • Terms: {ledgerClient.creditTerms.toUpperCase()}
                </p>
              </div>

              <button
                onClick={() => { setLedgerClient(null); setLedgerData(null); }}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ledger Financial Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-6 bg-slate-950 border-b border-slate-800">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Opening Balance</span>
                <span className="text-base font-bold text-white font-mono">{formatBDT(ledgerClient.openingBalance)}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Billed</span>
                <span className="text-base font-bold text-amber-400 font-mono">{formatBDT(ledgerData.totalBilled)}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Collected</span>
                <span className="text-base font-bold text-emerald-400 font-mono">{formatBDT(ledgerData.totalPaid)}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Net Balance Due</span>
                <span className={`text-base font-black font-mono ${ledgerData.runningBalance > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {formatBDT(ledgerData.runningBalance)}
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleSendStatementWhatsApp(ledgerClient, ledgerData.runningBalance)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send WhatsApp Statement</span>
                </button>

                <button
                  onClick={() => handleDownloadLedgerPDF(ledgerClient, ledgerData)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs uppercase"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download Ledger PDF</span>
                </button>

                <button
                  onClick={() => handleCreateCloudLogin(ledgerClient)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs uppercase"
                >
                  <Key className="w-3.5 h-3.5 text-blue-400" />
                  <span>Create Client Login</span>
                </button>
              </div>

              {onViewAsClient && (
                <button
                  onClick={() => {
                    const id = ledgerClient.id;
                    setLedgerClient(null);
                    onViewAsClient(id);
                  }}
                  className="text-xs text-blue-400 hover:underline font-semibold flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View As Client Portal →</span>
                </button>
              )}
            </div>

            {/* Invoices & Deliveries Scrollable History */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              <div className="space-y-3">
                <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                  Invoices ({ledgerData.invoices.length})
                </h4>
                {ledgerData.invoices.length === 0 ? (
                  <p className="text-slate-500">No invoices issued yet.</p>
                ) : (
                  <div className="border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
                    {ledgerData.invoices.map((inv) => (
                      <div key={inv.id} className="p-3 flex items-center justify-between bg-slate-950/40">
                        <div>
                          <span className="font-mono font-bold text-amber-400">{inv.invoiceNumber}</span>
                          <span className="text-slate-400 text-[11px] ml-2">Issued: {formatDate(inv.issueDate)}</span>
                          <span className="text-slate-400 text-[11px] ml-2">Due: {formatDate(inv.dueDate)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold">{formatBDT(inv.total)}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            inv.status === 'paid' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                          }`}>
                            {inv.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                  Recent Deliveries ({ledgerData.deliveries.length})
                </h4>
                {ledgerData.deliveries.length === 0 ? (
                  <p className="text-slate-500">No deliveries on record.</p>
                ) : (
                  <div className="border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
                    {ledgerData.deliveries.slice(0, 5).map((d) => (
                      <div key={d.id} className="p-3 flex items-center justify-between bg-slate-950/40">
                        <div>
                          <span className="font-mono font-bold text-slate-200">{d.deliveryNumber}</span>
                          <span className="text-slate-400 text-[11px] ml-2">{formatDate(d.date)}</span>
                          <span className="text-slate-400 text-[11px] ml-2">({d.items.length} items)</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-slate-300">{formatBDT(d.totalAmount)}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 uppercase">
                            {d.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT CLIENT MODAL */}
      {isEditModalOpen && editingClient && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold">
                {editingClient.id ? 'Edit Client Account' : 'Register New Commercial Client'}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Company / Business Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Bengal Restaurant"
                  value={editingClient.company || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, company: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={editingClient.contactName || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, contactName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={editingClient.phone || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Customer Category</label>
                  <select
                    value={editingClient.customerType || 'Restaurant'}
                    onChange={(e) => setEditingClient({ ...editingClient, customerType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="Restaurant">Restaurant</option>
                    <option value="Catering">Catering</option>
                    <option value="Supermarket">Supermarket</option>
                    <option value="Corporate Kitchen">Corporate Kitchen</option>
                    <option value="Food Service">Food Service</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Credit Settlement Terms</label>
                  <select
                    value={editingClient.creditTerms || 'weekly'}
                    onChange={(e) => setEditingClient({ ...editingClient, creditTerms: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="weekly">Weekly Settlement</option>
                    <option value="monthly">Monthly Settlement</option>
                    <option value="cash">Cash on Delivery</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Operating Hub / Division</label>
                  <select
                    value={editingClient.city || 'Dhaka'}
                    onChange={(e) => setEditingClient({ ...editingClient, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="Dhaka">Dhaka Central Hub</option>
                    <option value="Chattogram">Chattogram Regional Hub</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Opening Balance (BDT)</label>
                  <input
                    type="number"
                    value={editingClient.openingBalance || 0}
                    onChange={(e) => setEditingClient({ ...editingClient, openingBalance: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Delivery Address *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Kitchen / depot drop-off address"
                  value={editingClient.address || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLOUD CREDENTIALS MODAL */}
      {cloudCredModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-emerald-400">
              <Key className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase">Client Login Credentials</h3>
            </div>
            <p className="text-xs text-slate-300">
              Share these credentials with <strong>{cloudCredModal.client.company}</strong>. They can log in directly at <code>/client/login</code>.
            </p>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs space-y-1.5">
              <div>Email / Username: <strong className="text-amber-400">{cloudCredModal.email}</strong></div>
              <div>Temporary Password: <strong className="text-emerald-400">{cloudCredModal.tempPass}</strong></div>
            </div>

            <button
              onClick={() => setCloudCredModal(null)}
              className="w-full py-2.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs uppercase"
            >
              Done & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
