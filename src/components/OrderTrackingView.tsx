import React, { useState } from 'react';
import { 
  Search, CheckCircle2, Clock, MapPin, Phone, 
  Printer, ArrowLeft, Flame, Package, Bike, Sparkles, ChefHat
} from 'lucide-react';
import { useBakery } from '../context/BakeryContext';
import { Order, OrderStatus } from '../types/bakery';

export const OrderTrackingView: React.FC = () => {
  const { 
    orders, 
    trackingOrderId, 
    setTrackingOrderId, 
    setActiveTab, 
    setIsReviewModalOpen, 
    setReviewTargetItem 
  } = useBakery();

  const [searchQuery, setSearchQuery] = useState('');

  // Current active tracked order
  const currentOrder: Order | undefined = trackingOrderId
    ? orders.find(o => o.id === trackingOrderId)
    : orders[0]; // fallback to most recent order

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();
    const found = orders.find(
      o => o.id.toLowerCase() === query || o.customerPhone.includes(query)
    );

    if (found) {
      setTrackingOrderId(found.id);
    } else {
      alert(`No active bakery orders found matching "${searchQuery}". Please check your Order ID.`);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'placed': return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'baking': return 'bg-amber-600 text-white border-amber-700 animate-pulse';
      case 'packed': return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'delivered': return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      default: return 'bg-stone-100 text-stone-800';
    }
  };

  const getStepIcon = (index: number) => {
    switch (index) {
      case 0: return CheckCircle2;
      case 1: return Flame;
      case 2: return Package;
      case 3: return Bike;
      case 4: return CheckCircle2;
      default: return Clock;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Navigation & Lookup bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
        <button
          onClick={() => setActiveTab('store')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-amber-800" />
          <span>Back to Daily Bakery Counter</span>
        </button>

        {/* Order ID / Phone lookup */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Lookup Order ID (e.g. HC-9421)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:border-amber-900"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 bg-stone-900 text-stone-50 text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Track
          </button>
        </form>
      </div>

      {!currentOrder ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center max-w-md mx-auto">
          <Clock className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-serif text-xl font-bold text-stone-900">
            No Active Orders Selected
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Place an order from our fresh hearth catalog or search your order ID above.
          </p>
          <button
            onClick={() => setActiveTab('store')}
            className="mt-4 px-4 py-2 bg-amber-900 text-stone-50 text-xs font-semibold rounded-lg hover:bg-amber-800 transition-colors cursor-pointer"
          >
            Start Fresh Order
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Main Order Status Header Card */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-stone-900">
                    Order #{currentOrder.id}
                  </span>
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(currentOrder.status)}`}>
                    {currentOrder.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Placed on {currentOrder.placedAt} · {currentOrder.slot}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <div className="text-right pl-4 border-l border-stone-200">
                  <span className="text-[10px] text-stone-400 block uppercase tracking-wider">
                    Total Amount
                  </span>
                  <span className="font-serif text-2xl font-bold text-amber-900 tabular-nums">
                    ₹{currentOrder.total}
                  </span>
                </div>
              </div>
            </div>

            {/* Estimated Arrival / Preparation banner */}
            <div className="mt-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-900 text-white flex items-center justify-center shrink-0">
                  <ChefHat className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-stone-900 text-sm">
                    {currentOrder.status === 'delivered'
                      ? 'Bakes Delivered Fresh!'
                      : currentOrder.deliveryType === 'delivery'
                      ? 'Out-of-Oven Fresh Delivery'
                      : 'Bakes Packaging for Counter Pickup'}
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    {currentOrder.estimatedTime}
                  </p>
                </div>
              </div>

              <span className="text-xs font-medium text-amber-900 bg-white px-3 py-1 rounded border border-amber-200 shadow-xs">
                {currentOrder.deliveryType === 'delivery' ? 'Express Courier' : 'Self Counter Pickup'}
              </span>
            </div>

            {/* 5-Step Visual Timeline Stepper */}
            <div className="mt-8 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-6">
                Live Kitchen & Fulfillment Progress
              </h4>

              <div className="relative">
                {/* Connecting Line */}
                <div className="hidden md:block absolute top-1/2 left-4 right-4 h-0.5 bg-stone-200 -translate-y-1/2 -z-0" />

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
                  {currentOrder.timeline.map((step, idx) => {
                    const Icon = getStepIcon(idx);
                    return (
                      <div
                        key={step.status}
                        className={`p-3 rounded-xl border transition-all ${
                          step.done
                            ? 'bg-amber-50/80 border-amber-300'
                            : 'bg-stone-50 border-stone-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                            step.done ? 'bg-amber-900 text-amber-100' : 'bg-stone-200 text-stone-400'
                          }`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[10px] font-mono text-stone-500 tabular-nums">
                            {step.time}
                          </span>
                        </div>

                        <p className={`text-xs font-bold ${step.done ? 'text-stone-900' : 'text-stone-500'}`}>
                          {step.label}
                        </p>
                        <p className="text-[11px] text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* Two-Column Grid: Delivery/Contact Details & Itemized Receipt */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left: Customer & Delivery Information */}
            <div className="md:col-span-5 bg-white rounded-2xl border border-stone-200/90 p-6 space-y-4">
              <h4 className="font-serif text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
                Fulfillment & Contact
              </h4>

              <div className="space-y-3 text-xs text-stone-600">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">Patron Name</span>
                  <span className="font-semibold text-stone-900 text-sm">{currentOrder.customerName}</span>
                </div>

                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">Contact Phone</span>
                  <span className="font-semibold text-stone-900">{currentOrder.customerPhone}</span>
                </div>

                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">Payment</span>
                  <span className="font-semibold text-stone-900 uppercase">
                    {currentOrder.paymentMethod} · {currentOrder.paymentStatus === 'paid' ? 'Paid Online ✓' : 'Pay at Doorstep'}
                  </span>
                </div>

                {currentOrder.deliveryType === 'delivery' ? (
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Delivery Address</span>
                    <span className="font-medium text-stone-800 leading-relaxed block mt-0.5">
                      {currentOrder.deliveryAddress}
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Pickup Location</span>
                    <span className="font-medium text-stone-800 leading-relaxed block mt-0.5">
                      Hearth & Crumb Bakery, Shop 4, Colaba Causeway, Mumbai 400005.
                    </span>
                  </div>
                )}

                {currentOrder.notes && (
                  <div className="pt-2 border-t border-stone-100">
                    <span className="text-stone-400 block text-[10px] uppercase">Patron Note</span>
                    <span className="italic text-stone-700">"{currentOrder.notes}"</span>
                  </div>
                )}
              </div>

              {/* Feedback CTA */}
              <div className="pt-4 border-t border-stone-100">
                <button
                  onClick={() => {
                    setReviewTargetItem(null);
                    setIsReviewModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Rate This Batch & Experience
                </button>
              </div>
            </div>

            {/* Right: Itemized Bill in Indian Rupee (₹) */}
            <div className="md:col-span-7 bg-white rounded-2xl border border-stone-200/90 p-6 space-y-4">
              <h4 className="font-serif text-lg font-bold text-stone-900 pb-2 border-b border-stone-100 flex items-center justify-between">
                <span>Itemized Invoice (INR)</span>
                <span className="text-xs text-stone-400 font-sans font-normal">GSTIN: 27AABCH1234F1Z8</span>
              </h4>

              {/* Items List */}
              <div className="divide-y divide-stone-100">
                {currentOrder.items.map((item, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded object-cover bg-stone-100" 
                        />
                      )}
                      <div>
                        <p className="font-semibold text-stone-900">{item.name}</p>
                        <p className="text-[11px] text-stone-500 tabular-nums">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-stone-900 tabular-nums">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Taxes & Bill Breakdown */}
              <div className="pt-3 border-t border-stone-200/80 space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium text-stone-900">₹{currentOrder.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="tabular-nums">
                    {currentOrder.deliveryFee === 0 ? 'FREE' : `₹${currentOrder.deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Eco-Packaging Fee</span>
                  <span className="tabular-nums">₹{currentOrder.packagingFee}</span>
                </div>
                {currentOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Discount ({currentOrder.couponCode || 'Promo'})</span>
                    <span className="tabular-nums">-₹{currentOrder.discount}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline text-stone-900">
                  <span className="font-bold text-sm">Grand Total Paid</span>
                  <span className="font-serif text-2xl font-bold text-amber-900 tabular-nums">
                    ₹{currentOrder.total}
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Past Orders Shortcut List */}
          {orders.length > 1 && (
            <div className="bg-[#FAF8F5] rounded-xl border border-stone-200/80 p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
                Other Recent Orders
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {orders
                  .filter(o => o.id !== currentOrder.id)
                  .map(o => (
                    <div
                      key={o.id}
                      onClick={() => setTrackingOrderId(o.id)}
                      className="p-3 bg-white rounded-lg border border-stone-200 hover:border-amber-900 cursor-pointer transition-colors text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono font-bold text-stone-900">#{o.id}</span>
                        <span className="text-[11px] text-stone-500 block">{o.placedAt}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-amber-900 tabular-nums">₹{o.total}</span>
                        <span className="text-[10px] text-stone-500 block capitalize">{o.status}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
