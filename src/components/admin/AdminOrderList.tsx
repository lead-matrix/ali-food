import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { useAdmin } from '../../context/AdminContext';
import { formatBDT, createOrderWhatsAppMessage } from '../../utils/whatsapp';
import { Eye, Printer, MessageSquare, Phone, CheckCircle, Clock, Truck, XCircle, ChevronRight, X } from 'lucide-react';
import { COMPANY_INFO } from '../../data/companyInfo';

export const AdminOrderList: React.FC = () => {
  const { orders, updateOrderStatus } = useAdmin();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const statuses: OrderStatus[] = [
    'New',
    'Confirmed',
    'Processing',
    'Ready',
    'Dispatched',
    'Delivered',
    'Cancelled'
  ];

  const filteredOrders = orders.filter(o => 
    statusFilter === 'all' ? true : o.status === statusFilter
  );

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-950 text-blue-300 border-blue-800';
      case 'Confirmed':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'Processing':
        return 'bg-purple-950 text-purple-300 border-purple-800';
      case 'Ready':
        return 'bg-teal-950 text-teal-300 border-teal-800';
      case 'Dispatched':
        return 'bg-indigo-950 text-indigo-300 border-indigo-800';
      case 'Delivered':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'Cancelled':
        return 'bg-red-950 text-red-300 border-red-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono uppercase text-slate-400 mr-2">Filter Pipeline:</span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Orders ({orders.length})
          </button>
          {statuses.map(s => {
            const count = orders.filter(o => o.status === s).length;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === s
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {s} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[11px] font-mono uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer & Company</th>
                <th className="py-3 px-4">Delivery Logistics</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Subtotal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    No order requisitions match the selected status filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-slate-850/60 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                      {order.orderNumber}
                      <span className="block text-[10px] text-slate-500 font-sans">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{order.companyName}</div>
                      <div className="text-slate-400 text-[11px]">
                        {order.customerName} • {order.customerType}
                      </div>
                      <div className="text-slate-500 font-mono text-[10px]">{order.phone}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-200">
                        {order.deliveryCity} ({order.deliveryArea})
                      </span>
                      <span className="block text-[10px] text-emerald-400 font-medium">
                        Slot: {order.preferredTimeSlot.split(' ')[0]} {order.preferredTimeSlot.split(' ')[1]}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        Date: {order.preferredDate}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-300">
                        {order.items.length} Product line{order.items.length > 1 ? 's' : ''}
                      </span>
                      <div className="text-[10px] text-slate-500 truncate max-w-xs">
                        {order.items.map(i => `${i.productName} (${i.quantity} ${i.unit})`).join(', ')}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-sm">
                      {formatBDT(order.estimatedTotal)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white inline-flex items-center gap-1 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Inspection Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase text-amber-400 font-bold">
                    Official Requisition
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getStatusBadge(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white font-mono">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
              {/* Status Updater */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-mono text-[10px] uppercase text-slate-400 block font-bold">
                  Update Order Pipeline Status:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {statuses.map(s => (
                    <button
                      key={s}
                      onClick={() => updateOrderStatus(selectedOrder.id, s)}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                        selectedOrder.status === s
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Client & Hub details */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-mono">Client Organization</span>
                  <strong className="text-white text-sm block">{selectedOrder.companyName}</strong>
                  <span className="text-slate-300 block">{selectedOrder.customerName} ({selectedOrder.customerType})</span>
                  <span className="text-amber-400 font-mono block pt-1">{selectedOrder.phone}</span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-mono">Delivery Logistics</span>
                  <strong className="text-white block">{selectedOrder.deliveryCity} Hub ({selectedOrder.deliveryArea})</strong>
                  <span className="text-slate-300 block">{selectedOrder.deliveryAddress}</span>
                  <span className="text-emerald-400 block pt-1 font-semibold">{selectedOrder.preferredDate} • {selectedOrder.preferredTimeSlot}</span>
                </div>
              </div>

              {/* Special instructions */}
              {selectedOrder.specialInstructions && (
                <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/60 text-amber-200">
                  <strong className="block font-bold mb-0.5">Special Cut & Portion Instructions:</strong>
                  <span>{selectedOrder.specialInstructions}</span>
                </div>
              )}

              {/* Line items table */}
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-950 px-4 py-2 text-[10px] font-mono uppercase text-slate-400 flex justify-between">
                  <span>Product & Specifications</span>
                  <span>Quantity & Subtotal</span>
                </div>
                <div className="divide-y divide-slate-800">
                  {selectedOrder.items.map((i, idx) => (
                    <div key={idx} className="p-3 flex items-start justify-between">
                      <div>
                        <strong className="text-white block">{i.productName}</strong>
                        {i.customNotes && (
                          <span className="text-[11px] text-amber-400 block">
                            Cut: {i.customNotes}
                          </span>
                        )}
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-white font-bold">{i.quantity} {i.unit}</span>
                        <span className="block text-slate-400 text-[11px]">
                          {i.priceVisible ? formatBDT(i.subtotal) : 'Quote Basis'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => updateOrderStatus(selectedOrder.id, 'Confirmed')}
                  className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Confirm Order</span>
                </button>

                <button
                  onClick={() => updateOrderStatus(selectedOrder.id, 'Delivered')}
                  className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Mark Delivered</span>
                </button>

                <a
                  href={createOrderWhatsAppMessage(selectedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 font-bold text-xs uppercase flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send WhatsApp</span>
                </a>

                <a
                  href={`tel:${selectedOrder.phone}`}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs uppercase flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Call Customer</span>
                </a>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs uppercase flex items-center gap-1.5 ml-auto"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip / PDF</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Hidden Print-Only Commercial Delivery Slip (Visible when printing) */}
      {selectedOrder && (
        <div className="hidden print:block fixed inset-0 bg-white text-black p-8 text-xs font-sans z-[9999]">
          <div className="border-b-2 border-black pb-4 mb-4 flex justify-between items-start">
            <div>
              <img src="/images/alifood-official-banner.png" alt="M/S Ali Food" className="h-12 w-auto object-contain mb-2" />
              <h1 className="text-xl font-black tracking-tight">M/S ALI FOOD</h1>
              <p className="font-bold text-xs">Wholesale Poultry, Meat & Dressed Cuts Partner</p>
              <p className="text-[10px] text-gray-600">Dhaka Head Office: 7/1 Jam Jam Market, 1 No Rail Gate, Tejgaon, Dhaka-1208</p>
              <p className="text-[10px] text-gray-600">Chattogram: Toiyobiya Garden, 238 D.T. Road, West Madarbari</p>
              <p className="text-[10px] text-gray-600">Hotlines: 01319-345501, 01401-238019 • Email: alifood3193@gmail.com</p>
            </div>
            <div className="text-right">
              <div className="font-mono text-sm font-black border border-black px-2 py-1 inline-block">
                {selectedOrder.orderNumber}
              </div>
              <p className="text-[10px] mt-1">Vendor Code: {COMPANY_INFO.vendorCode}</p>
              <p className="text-[10px]">Record Ref: {COMPANY_INFO.recordRef}</p>
              <p className="text-[10px]">Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 border border-gray-200">
            <div>
              <p className="font-bold uppercase text-[10px] text-gray-500">Bill To / Institutional Client:</p>
              <p className="font-black text-sm">{selectedOrder.companyName}</p>
              <p>Attn: {selectedOrder.customerName} ({selectedOrder.customerType})</p>
              <p>Phone: {selectedOrder.phone} | WhatsApp: {selectedOrder.whatsapp}</p>
            </div>
            <div>
              <p className="font-bold uppercase text-[10px] text-gray-500">Delivery Logistics:</p>
              <p><strong>Hub:</strong> {selectedOrder.deliveryCity} Regional Division</p>
              <p><strong>Destination:</strong> {selectedOrder.deliveryAddress}, {selectedOrder.deliveryArea}</p>
              <p><strong>Delivery Window:</strong> {selectedOrder.preferredDate} ({selectedOrder.preferredTimeSlot})</p>
            </div>
          </div>

          <table className="w-full border-collapse mb-4">
            <thead>
              <tr className="border-y-2 border-black bg-gray-100 font-bold text-[10px] uppercase">
                <th className="py-1.5 px-2 text-left">Sl</th>
                <th className="py-1.5 px-2 text-left">Product & Cut Specification</th>
                <th className="py-1.5 px-2 text-center">Qty</th>
                <th className="py-1.5 px-2 text-right">Unit Rate</th>
                <th className="py-1.5 px-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs">
              {selectedOrder.items.map((it, i) => (
                <tr key={i}>
                  <td className="py-2 px-2 font-mono">{i + 1}</td>
                  <td className="py-2 px-2">
                    <strong>{it.productName}</strong>
                    {it.customNotes && <div className="text-[10px] text-gray-600">Cut Instructions: {it.customNotes}</div>}
                  </td>
                  <td className="py-2 px-2 text-center font-mono">{it.quantity} {it.unit}</td>
                  <td className="py-2 px-2 text-right font-mono">{it.priceVisible ? formatBDT(it.unitPrice) : 'Quotation'}</td>
                  <td className="py-2 px-2 text-right font-mono font-bold">{it.priceVisible ? formatBDT(it.subtotal) : 'Quotation'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-black font-bold">
                <td colSpan={4} className="py-2 px-2 text-right uppercase">Estimated Gross Total:</td>
                <td className="py-2 px-2 text-right font-mono text-sm">{formatBDT(selectedOrder.estimatedTotal)}</td>
              </tr>
            </tfoot>
          </table>

          {selectedOrder.specialInstructions && (
            <div className="mb-4 p-2 border border-gray-300 text-[10px]">
              <strong>Special Instructions:</strong> {selectedOrder.specialInstructions}
            </div>
          )}

          <div className="mt-12 pt-4 border-t border-gray-300 flex justify-between items-end text-[10px]">
            <div>
              <p>Terms: Weekly / Monthly Corporate Settlement</p>
              <p>100% Halal Manual Slaughter • Active Chill-Chain</p>
            </div>
            <div className="text-center">
              <div className="w-40 border-b border-black mb-1"></div>
              <p className="font-bold">Authorized Dispatch Officer</p>
              <p className="text-gray-500">M/S Ali Food</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
