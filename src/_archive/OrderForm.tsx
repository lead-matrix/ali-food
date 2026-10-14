import React, { useState } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, Send, Phone, MessageSquare, AlertCircle, Building2, MapPin, Calendar, Clock, Scissors, FileText, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAdmin } from '../../context/AdminContext';
import { CustomerType, Order } from '../../types';
import { formatBDT, generateOrderNumber } from '../../utils/whatsapp';
import { sendOrderNotification } from '../../utils/notifications';
import { OrderSuccessModal } from './OrderSuccessModal';
import { COMPANY_INFO } from '../../data/companyInfo';

interface OrderFormProps {
  navigate: (path: string) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ navigate }) => {
  const { items, updateQuantity, updateCustomNotes, removeFromOrder, clearOrder, estimatedSubtotal, hasQuoteItems } = useCart();
  const { addOrder } = useAdmin();

  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [customerType, setCustomerType] = useState<CustomerType>('Restaurant');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryCity, setDeliveryCity] = useState<'Dhaka' | 'Chattogram'>('Dhaka');
  const [deliveryArea, setDeliveryArea] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  
  // Date default to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];
  const [preferredDate, setPreferredDate] = useState(defaultDateStr);

  const [preferredTimeSlot, setPreferredTimeSlot] = useState<Order['preferredTimeSlot']>(
    '5:00 AM - 8:00 AM (Pre-dawn Route)'
  );
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [recurringDelivery, setRecurringDelivery] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert('Your order basket is currently empty. Please select products from the catalog.');
      navigate('/products');
      return;
    }

    setIsSubmitting(true);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: generateOrderNumber(),
      customerName,
      companyName: companyName || customerName,
      customerType,
      phone,
      whatsapp: whatsapp || phone,
      email: email || COMPANY_INFO.email,
      deliveryCity,
      deliveryArea: deliveryArea || (deliveryCity === 'Dhaka' ? 'Tejgaon / Central' : 'West Madarbari'),
      deliveryAddress,
      preferredDate,
      preferredTimeSlot,
      specialInstructions: `${specialInstructions}${recurringDelivery ? ' [Recurring Weekly Supply Requested]' : ''}`,
      items: [...items],
      estimatedTotal: estimatedSubtotal,
      hasQuoteItems,
      status: 'New',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Send automated email notification to alifood3193@gmail.com
    sendOrderNotification(newOrder).catch(console.error);

    setTimeout(() => {
      addOrder(newOrder);
      setSubmittedOrder(newOrder);
      setIsSubmitting(false);
      clearOrder();
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono font-bold uppercase">
          <Building2 className="w-3.5 h-3.5 text-amber-600" />
          <span>Institutional B2B Procurement Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Request Wholesale Supply
        </h1>
        <p className="text-slate-600 text-sm max-w-2xl">
          Submit your product requirements, portioning notes, and preferred pre-dawn delivery slot. Our operations hub will log and verify your requisition.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Customer & Delivery Details Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Client Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>1. Business & Contact Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chef / Procurement Manager"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Company / Restaurant Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Royal Bistro / Superstore Ltd."
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Client Category *
                  </label>
                  <select
                    value={customerType}
                    onChange={e => setCustomerType(e.target.value as CustomerType)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  >
                    <option value="Restaurant">Restaurant</option>
                    <option value="Catering">Catering Company</option>
                    <option value="Supermarket">Supermarket Chain</option>
                    <option value="Corporate Kitchen">Corporate Kitchen / Canteen</option>
                    <option value="Food Service">Food-Service Franchise</option>
                    <option value="Wholesale Buyer">Wholesale Buyer</option>
                    <option value="Other">Other Institutional Buyer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Direct Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm font-mono focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Same as phone"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm font-mono focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Email (for Invoicing & Confirmations)
                </label>
                <input
                  type="email"
                  placeholder="accounts@restaurant.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Delivery Details */}
            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>2. Delivery Logistics & Schedule</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Delivery Hub / City *
                  </label>
                  <select
                    value={deliveryCity}
                    onChange={e => setDeliveryCity(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  >
                    <option value="Dhaka">Dhaka Central Division (Tejgaon Hub)</option>
                    <option value="Chattogram">Chattogram Regional Division (West Madarbari Hub)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Area / Zone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={deliveryCity === 'Dhaka' ? "e.g. Tejgaon, Gulshan, Dhanmondi" : "e.g. Agrabad, Khulshi, GEC"}
                    value={deliveryArea}
                    onChange={e => setDeliveryArea(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Kitchen / Depot Address *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Street address, building name, floor/unit, nearest landmark..."
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-amber-500 focus:bg-white resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Preferred Delivery Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={e => setPreferredDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm font-mono focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    Preferred Route Slot *
                  </label>
                  <select
                    value={preferredTimeSlot}
                    onChange={e => setPreferredTimeSlot(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  >
                    <option value="5:00 AM - 8:00 AM (Pre-dawn Route)">
                      5:00 AM - 8:00 AM (Pre-dawn Route • Recommended)
                    </option>
                    <option value="8:00 AM - 12:00 PM (Morning Express)">
                      8:00 AM - 12:00 PM (Morning Express)
                    </option>
                    <option value="12:00 PM - 4:00 PM (Afternoon Delivery)">
                      12:00 PM - 4:00 PM (Afternoon Delivery)
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Special Processing Requirements */}
            <div className="space-y-3 pt-4">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                <Scissors className="w-4 h-4 text-amber-600" />
                <span>3. Special Cut & Packaging Instructions</span>
              </h3>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Culinary portioning notes (e.g. Skinless, with skin, 4-way curry cut, boneless tenderloin, vacuum pack, specific bird weights):
                </label>
                <textarea
                  rows={2}
                  placeholder="Detail any culinary requirements or kitchen prep instructions..."
                  value={specialInstructions}
                  onChange={e => setSpecialInstructions(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-amber-500 focus:bg-white resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="recurringCheck"
                  checked={recurringDelivery}
                  onChange={e => setRecurringDelivery(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                />
                <label htmlFor="recurringCheck" className="text-xs font-semibold text-slate-800 cursor-pointer">
                  Request Recurring Supply Contract (Weekly / Monthly settlement)
                </label>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Logging Order Request...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-slate-950" />
                    <span>Submit B2B Order Request ({formatBDT(estimatedSubtotal)})</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>No upfront payment required. Order is processed upon logistics verification.</span>
              </div>
            </div>

          </form>
        </div>

        {/* Right: Order Summary Cart (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div
            className="text-white rounded-2xl border p-6 shadow-xl sticky top-24"
            style={{ background: '#1C0808', borderColor: '#3D1010' }}
          >
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold tracking-tight">Order Basket</h3>
              </div>
              {items.length > 0 && (
                <button
                  onClick={clearOrder}
                  className="text-xs text-slate-400 hover:text-red-400 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Items List */}
            <div className="py-4 divide-y divide-slate-800/80 max-h-96 overflow-y-auto pr-1">
              {items.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <ShoppingBag className="w-10 h-10 text-slate-700 mx-auto" />
                  <p className="text-xs text-slate-400">Your wholesale order basket is empty.</p>
                  <button
                    onClick={() => navigate('/products')}
                    className="inline-block px-4 py-2 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider"
                  >
                    Select Products
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.productId} className="py-3 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">
                          {item.productName}
                        </h4>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          Rate: {item.priceVisible ? `${formatBDT(item.unitPrice)}/${item.unit}` : 'Quotation Basis'}
                        </span>
                      </div>

                      <button
                        onClick={() => removeFromOrder(item.productId)}
                        className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Quantity Stepper & Subtotal */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center border border-slate-700 rounded-lg bg-slate-950 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 5)}
                          className="px-2 py-1 text-slate-400 hover:bg-slate-800"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-bold text-amber-400 min-w-10 text-center">
                          {item.quantity} {item.unit}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 5)}
                          className="px-2 py-1 text-slate-400 hover:bg-slate-800"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-white block">
                          {item.priceVisible ? formatBDT(item.subtotal) : 'Quote Basis'}
                        </span>
                      </div>
                    </div>

                    {/* Quick Item Note Input */}
                    <input
                      type="text"
                      placeholder="Cut note: e.g. Skinless, curry cut..."
                      value={item.customNotes || ''}
                      onChange={e => updateCustomNotes(item.productId, e.target.value)}
                      className="w-full text-[11px] px-2 py-1 rounded bg-slate-800/80 border border-slate-700 text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                ))
              )}
            </div>

            {/* Basket Totals */}
            {items.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Selected Products</span>
                  <span className="font-mono">{items.length} items</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Delivery Logistics</span>
                  <span className="text-emerald-400">Scheduled Dispatch</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-800">
                  <span className="text-sm font-extrabold text-white">Estimated Subtotal:</span>
                  <div className="text-right font-mono">
                    <span className="text-xl font-black text-amber-400">
                      {formatBDT(estimatedSubtotal)}
                    </span>
                    {hasQuoteItems && (
                      <span className="block text-[10px] text-slate-400">+ Custom Quote items</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Hotline Assistance */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Need immediate dispatch?</span>
              </span>
              <a
                href={`tel:${COMPANY_INFO.hotlines[0].raw}`}
                className="font-mono text-amber-400 font-bold hover:underline"
              >
                {COMPANY_INFO.hotlines[0].number}
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* Success Modal */}
      <OrderSuccessModal
        order={submittedOrder}
        onClose={() => setSubmittedOrder(null)}
        navigate={navigate}
      />
    </div>
  );
};
