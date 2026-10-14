import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  FileText, 
  Truck, 
  CreditCard, 
  MessageSquare, 
  Phone, 
  Download, 
  LogOut, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Send, 
  Calendar,
  X,
  Printer
} from 'lucide-react';
import { getRepo } from '../lib/db/repository';
import { Client, Invoice, Delivery, Payment, Complaint, ComplaintMessage } from '../lib/db/types';
import { formatBDT, formatDate, formatDateTime } from '../utils/formatters';
import { generateInvoicePDF, generateDeliveryChallanPDF } from '../utils/pdfGenerator';
import { COMPANY_INFO } from '../data/companyInfo';
import { createGeneralWhatsAppLink } from '../utils/whatsapp';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ClientPortalPageProps {
  impersonatedClientId?: string | null;
  navigate?: (path: string) => void;
}

export const ClientPortalPage: React.FC<ClientPortalPageProps> = ({
  impersonatedClientId,
  navigate,
}) => {
  const repo = getRepo();
  const [clientId, setClientId] = useState<string | null>(() => {
    if (impersonatedClientId) return impersonatedClientId;
    try {
      const saved = localStorage.getItem('alifood_client_auth');
      return saved ? JSON.parse(saved).clientId : null;
    } catch {
      return null;
    }
  });

  const [client, setClient] = useState<Client | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [ledger, setLedger] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'deliveries' | 'statement' | 'complaints'>('overview');

  // Modals
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [complaintReply, setComplaintReply] = useState('');
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
  const [newComplaintData, setNewComplaintData] = useState<Partial<Complaint>>({
    category: 'quality',
    priority: 'medium',
  });

  const loadClientData = async () => {
    if (!clientId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [c, iList, dList, pList, cmpList, led] = await Promise.all([
        repo.getClientById(clientId),
        repo.getInvoices(clientId),
        repo.getDeliveries(clientId),
        repo.getPayments(clientId),
        repo.getComplaints(clientId),
        repo.getClientLedger(clientId),
      ]);

      setClient(c);
      setInvoices(iList);
      setDeliveries(dList);
      setPayments(pList);
      setComplaints(cmpList);
      setLedger(led);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientData();
  }, [clientId]);

  const handleDownloadInvoicePDF = async (inv: Invoice) => {
    try {
      const settings = await repo.getSettings();
      generateInvoicePDF(inv, settings);
    } catch (e) {
      alert('Failed to download invoice PDF');
    }
  };

  const handleDownloadChallan = async (del: Delivery) => {
    try {
      const settings = await repo.getSettings();
      generateDeliveryChallanPDF(del, settings);
    } catch (e) {
      alert('Failed to download delivery challan');
    }
  };

  const handleDownloadStatementPDF = () => {
    if (!client || !ledger) return;
    const doc = new jsPDF();
    doc.setFillColor(28, 8, 8);
    doc.rect(0, 0, 210, 32, 'F');

    doc.setTextColor(245, 166, 35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('M/S ALI FOOD - CLIENT STATEMENT', 14, 14);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`Commercial Client: ${client.company} (${client.code})`, 14, 21);
    doc.text(`Generated on: ${formatDate(new Date())}`, 14, 27);

    let y = 42;
    doc.setTextColor(20, 20, 20);
    doc.setFontSize(9);
    doc.text(`Opening Balance: ${formatBDT(client.openingBalance)}`, 14, y);
    doc.text(`Total Billed: ${formatBDT(ledger.totalBilled)}`, 70, y);
    doc.text(`Total Paid: ${formatBDT(ledger.totalPaid)}`, 130, y);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 38);
    doc.text(`Net Due Balance: ${formatBDT(ledger.runningBalance)}`, 14, y + 7);

    const invRows = ledger.invoices.map((inv: Invoice) => [
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

    doc.save(`${client.code}_Statement.pdf`);
  };

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !newComplaintData.subject) return;

    try {
      const created = await repo.saveComplaint({
        ...newComplaintData,
        clientId,
        status: 'open',
        priority: newComplaintData.priority || 'medium',
      });

      if (newComplaintData.messages && newComplaintData.messages[0]?.message) {
        await repo.addComplaintMessage(created.id, {
          senderRole: 'client',
          senderName: client?.contactName || 'Client',
          message: newComplaintData.messages[0].message,
        });
      }

      setIsNewComplaintOpen(false);
      setNewComplaintData({ category: 'quality', priority: 'medium' });
      loadClientData();
    } catch (err: any) {
      alert(err.message || 'Failed to submit complaint');
    }
  };

  const handleSendComplaintReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint || !complaintReply.trim()) return;

    try {
      await repo.addComplaintMessage(selectedComplaint.id, {
        senderRole: 'client',
        senderName: client?.contactName || 'Client Representative',
        message: complaintReply.trim(),
      });
      setComplaintReply('');
      loadClientData();
    } catch (err: any) {
      alert(err.message || 'Failed to send message');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('alifood_client_auth');
    if (navigate) {
      navigate('/client/login');
    } else {
      window.location.href = '/client/login';
    }
  };

  if (!clientId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full text-center space-y-4 shadow-xl">
          <UserCheck className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Client Portal Login Required</h2>
          <p className="text-xs text-slate-500">
            Please log in with your authorized client credentials to access your daily dispatches and billing statements.
          </p>
          <button
            onClick={() => (navigate ? navigate('/client/login') : (window.location.href = '/client/login'))}
            className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase"
          >
            Go to Client Login
          </button>
        </div>
      </div>
    );
  }

  // Next due invoice
  const unpaidInvoices = invoices.filter((i) => i.status !== 'paid' && i.status !== 'void' && i.dueAmount > 0);
  unpaidInvoices.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const nextDueInvoice = unpaidInvoices[0];
  const lastPayment = payments[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col pb-16 lg:pb-0">
      {/* Client Header */}
      <header className="sticky top-0 z-30 bg-[#1C0808] border-b border-[#3D1010] text-white px-4 sm:px-6 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <div>
              <h1 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{client?.company || 'Commercial Client'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  {client?.code}
                </span>
              </h1>
              <span className="text-[11px] text-slate-400">
                Contact: {client?.contactName} • Terms: {client?.creditTerms?.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${COMPANY_INFO.hotlines[0].raw}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A0A0A] hover:bg-[#3D1212] border border-[#4A1515] text-xs font-semibold text-slate-200"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Call Ali Food Desk</span>
            </a>

            {!impersonatedClientId && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
        
        {/* Navigation Tabs */}
        <div className="flex rounded-xl bg-white border border-slate-200 p-1 text-xs shadow-sm overflow-x-auto">
          {[
            { id: 'overview', label: 'Account Overview', icon: UserCheck },
            { id: 'invoices', label: `Invoices (${invoices.length})`, icon: FileText },
            { id: 'deliveries', label: `Deliveries (${deliveries.length})`, icon: Truck },
            { id: 'statement', label: 'Statement Ledger', icon: CreditCard },
            { id: 'complaints', label: `Support Tickets (${complaints.length})`, icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-2">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
                  Total Outstanding Balance
                </span>
                <div className={`text-3xl font-black font-mono ${ledger?.runningBalance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {formatBDT(ledger?.runningBalance || 0)}
                </div>
                <span className="text-xs text-slate-500">
                  {client?.creditTerms?.toUpperCase()} settlement account
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-2">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
                  Next Due Date
                </span>
                <div className="text-3xl font-black text-slate-900 font-mono">
                  {nextDueInvoice ? formatDate(nextDueInvoice.dueDate) : 'All Settled'}
                </div>
                <span className="text-xs text-slate-500">
                  {nextDueInvoice ? `Invoice: ${nextDueInvoice.invoiceNumber} (${formatBDT(nextDueInvoice.dueAmount)})` : 'Zero pending overdue items'}
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-2">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
                  Last Payment Received
                </span>
                <div className="text-3xl font-black text-emerald-600 font-mono">
                  {lastPayment ? formatBDT(lastPayment.amount) : '—'}
                </div>
                <span className="text-xs text-slate-500">
                  {lastPayment ? `On ${formatDate(lastPayment.date)} via ${lastPayment.method.toUpperCase()}` : 'No payments logged yet'}
                </span>
              </div>
            </div>

            {/* Quick Actions & Bank Account Info */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-slate-900">
                  Official Settlement Accounts (Bank & Mobile Banking)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Please deposit payments quoting your client code <strong>{client?.code}</strong>:
                </p>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-sans">Bank Deposit / BEFTN</span>
                    <strong className="text-slate-900">Dutch-Bangla Bank PLC | A/C Name: M/S Ali Food</strong>
                    <div>A/C Number: <strong className="text-amber-800">123.110.456789</strong> (Tejgaon Branch)</div>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-6">
                    <div>bKash Merchant: <strong className="text-pink-700">01319-345501</strong></div>
                    <div>Nagad Merchant: <strong className="text-orange-700">01401-238019</strong></div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={createGeneralWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase shadow transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Payment Slip on WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${COMPANY_INFO.hotlines[0].raw}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase"
                  >
                    <Phone className="w-4 h-4 text-amber-400" />
                    <span>Call Accounts Desk</span>
                  </a>
                </div>
              </div>

              {/* Right: Recent Dispatch Summary */}
              <div className="md:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-amber-600" />
                    <span>Latest Dispatches</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('deliveries')}
                    className="text-xs text-amber-800 font-bold hover:underline"
                  >
                    View All
                  </button>
                </div>

                {deliveries.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No recent deliveries on record.</p>
                ) : (
                  <div className="divide-y divide-slate-100 text-xs">
                    {deliveries.slice(0, 4).map((d) => (
                      <div key={d.id} className="py-2.5 flex items-center justify-between">
                        <div>
                          <div className="font-mono font-bold text-slate-800">{d.deliveryNumber}</div>
                          <div className="text-[11px] text-slate-500">{formatDate(d.date)}</div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-slate-900">{formatBDT(d.totalAmount)}</span>
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                              {d.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. INVOICES TAB */}
        {activeTab === 'invoices' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  <span>Commercial Invoices ({invoices.length})</span>
                </h3>
                <span className="text-xs text-slate-500">Official statement invoices issued to your company</span>
              </div>
            </div>

            {invoices.length === 0 ? (
              <p className="text-center py-12 text-xs text-slate-500">No invoices have been issued yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px] uppercase">
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Issue Date</th>
                      <th className="py-3 px-4">Due Date</th>
                      <th className="py-3 px-4 text-right">Invoice Total</th>
                      <th className="py-3 px-4 text-right">Paid</th>
                      <th className="py-3 px-4 text-right">Balance Due</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">PDF</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-amber-50/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-800">
                          {inv.invoiceNumber}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">{formatDate(inv.issueDate)}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">{formatDate(inv.dueDate)}</td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">{formatBDT(inv.total)}</td>
                        <td className="py-3.5 px-4 text-right font-mono text-emerald-700">{formatBDT(inv.paidAmount)}</td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-red-600">{formatBDT(inv.dueAmount)}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                            inv.status === 'partial' ? 'bg-amber-100 text-amber-800' :
                            inv.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDownloadInvoicePDF(inv)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm"
                            title="Download Official PDF Invoice"
                          >
                            <Download className="w-3.5 h-3.5 text-amber-400" />
                            <span>Download PDF</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 3. DELIVERIES TAB */}
        {activeTab === 'deliveries' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-amber-600" />
                  <span>Pre-Dawn Delivery Dispatches ({deliveries.length})</span>
                </h3>
                <span className="text-xs text-slate-500">Scheduled and delivered wholesale drop-offs</span>
              </div>
            </div>

            {deliveries.length === 0 ? (
              <p className="text-center py-12 text-xs text-slate-500">No deliveries on record.</p>
            ) : (
              <div className="space-y-3">
                {deliveries.map((d) => (
                  <div key={d.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                      <div>
                        <span className="font-mono font-bold text-sm text-amber-900">{d.deliveryNumber}</span>
                        <span className="text-slate-500 text-xs ml-3">Date: {formatDate(d.date)} (Pre-dawn Route)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                          {d.status}
                        </span>
                        <button
                          onClick={() => handleDownloadChallan(d)}
                          className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold flex items-center gap-1"
                        >
                          <Printer className="w-3 h-3 text-amber-600" />
                          <span>Challan</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <strong className="text-slate-700 block mb-1">Delivered Items:</strong>
                        <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                          {d.items.map((i, idx) => (
                            <li key={idx}>
                              {i.productName} — <strong>{i.qty} {i.unit}</strong> (@ {formatBDT(i.rate)})
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-1 text-slate-600 text-right sm:text-right">
                        <div>Total Batch Gross: <strong className="font-mono text-slate-900 text-sm">{formatBDT(d.totalAmount)}</strong></div>
                        {d.vehicleDriver && <div>Driver / Logistics: {d.vehicleDriver}</div>}
                        {d.receivedBy && <div className="text-emerald-700">Received by: {d.receivedBy} ({d.receivedAt})</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. STATEMENT LEDGER TAB */}
        {activeTab === 'statement' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <span>Account Statement Ledger</span>
                </h3>
                <span className="text-xs text-slate-500">Complete transaction history of dispatches and payments</span>
              </div>

              <button
                onClick={handleDownloadStatementPDF}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase shadow"
              >
                <Download className="w-4 h-4" />
                <span>Download Statement PDF</span>
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-mono block">Opening Balance</span>
                <span className="font-bold text-slate-900 text-sm font-mono">{formatBDT(client?.openingBalance || 0)}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-mono block">Total Invoiced</span>
                <span className="font-bold text-amber-800 text-sm font-mono">{formatBDT(ledger?.totalBilled || 0)}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-mono block">Total Paid</span>
                <span className="font-bold text-emerald-700 text-sm font-mono">{formatBDT(ledger?.totalPaid || 0)}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-mono block">Current Balance</span>
                <span className={`font-black text-base font-mono ${ledger?.runningBalance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {formatBDT(ledger?.runningBalance || 0)}
                </span>
              </div>
            </div>

            {/* Ledger Transactions */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 uppercase text-[11px]">Payments Recorded ({payments.length})</h4>
              {payments.length === 0 ? (
                <p className="text-slate-500 italic">No payments logged yet.</p>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {payments.map((p) => (
                    <div key={p.id} className="p-3 flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-emerald-700">{p.paymentNumber}</span>
                        <span className="text-slate-500 ml-3">Date: {formatDate(p.date)}</span>
                        <span className="text-slate-500 ml-3">Method: {p.method.toUpperCase()}</span>
                        {p.reference && <span className="text-slate-500 ml-3 font-mono">Ref: {p.reference}</span>}
                      </div>
                      <div className="font-mono font-black text-emerald-700 text-sm">
                        {formatBDT(p.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. COMPLAINTS & TICKETS TAB */}
        {activeTab === 'complaints' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-600" />
                  <span>Support Tickets & Quality Feedback ({complaints.length})</span>
                </h3>
                <span className="text-xs text-slate-500">Report cutting quality issues, portioning requests, or delivery queries</span>
              </div>

              <button
                onClick={() => setIsNewComplaintOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase shadow"
              >
                <Plus className="w-4 h-4" />
                <span>+ Raise New Ticket</span>
              </button>
            </div>

            {complaints.length === 0 ? (
              <p className="text-center py-12 text-xs text-slate-500">No support tickets raised. Everything is running smoothly!</p>
            ) : (
              <div className="space-y-3">
                {complaints.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedComplaint(c)}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-amber-800">{c.complaintNumber}</span>
                        <h4 className="font-bold text-slate-900 text-sm">{c.subject}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        c.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span className="capitalize">Category: {c.category} • Priority: {c.priority}</span>
                      <span>{c.messages?.length || 0} messages • Click to open conversation →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* COMPLAINT THREAD CONVERSATION MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-mono font-bold text-xs text-amber-800">{selectedComplaint.complaintNumber}</span>
                <h3 className="text-base font-bold text-slate-900">{selectedComplaint.subject}</h3>
                <span className="text-xs text-slate-500 capitalize">Status: {selectedComplaint.status}</span>
              </div>
              <button onClick={() => setSelectedComplaint(null)} className="p-1 rounded text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {(selectedComplaint.messages || []).map((m) => {
                const isFromClient = m.senderRole === 'client';
                return (
                  <div key={m.id} className={`flex flex-col ${isFromClient ? 'items-end' : 'items-start'}`}>
                    <div className="text-[10px] text-slate-400 mb-1">
                      <strong>{m.senderName}</strong> • {formatDateTime(m.createdAt)}
                    </div>
                    <div className={`p-3 rounded-2xl max-w-lg leading-relaxed ${
                      isFromClient ? 'bg-amber-500 text-slate-950 font-medium rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'
                    }`}>
                      {m.message}
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSendComplaintReply} className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
              <input
                type="text"
                placeholder="Write reply to M/S Ali Food desk..."
                value={complaintReply}
                onChange={(e) => setComplaintReply(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={!complaintReply.trim()}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RAISE NEW COMPLAINT MODAL */}
      {isNewComplaintOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Raise Quality / Supply Ticket</h3>
              <button onClick={() => setIsNewComplaintOpen(false)} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateComplaint} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category *</label>
                <select
                  value={newComplaintData.category || 'quality'}
                  onChange={(e) => setNewComplaintData({ ...newComplaintData, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm"
                >
                  <option value="quality">Product Cutting / Quality</option>
                  <option value="quantity">Quantity / Weight Variance</option>
                  <option value="late">Delivery Delay</option>
                  <option value="billing">Invoice / Statement Query</option>
                  <option value="other">Other Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject / Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Skinless drumstick size variation on today dispatch"
                  value={newComplaintData.subject || ''}
                  onChange={(e) => setNewComplaintData({ ...newComplaintData, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Message *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide batch details, delivery number or specific portion requirements..."
                  value={newComplaintData.messages?.[0]?.message || ''}
                  onChange={(e) => setNewComplaintData({
                    ...newComplaintData,
                    messages: [{ id: '', complaintId: '', senderRole: 'client', senderName: client?.contactName || 'Client', message: e.target.value, createdAt: '' }]
                  })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewComplaintOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPortalPage;
