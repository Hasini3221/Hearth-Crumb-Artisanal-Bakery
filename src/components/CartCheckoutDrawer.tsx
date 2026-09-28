import React, { useState } from 'react';
import { 
  X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, 
  MapPin, Clock, CreditCard, QrCode, Banknote, Building, 
  Check, Tag, AlertCircle 
} from 'lucide-react';
import { useBakery } from '../context/BakeryContext';
import { AVAILABLE_COUPONS } from '../data/initialData';

export const CartCheckoutDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    cartSubtotal,
    placeOrder,
    setActiveTab,
    setTrackingOrderId
  } = useBakery();

  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [pincode, setPincode] = useState('400005');
  const [slot, setSlot] = useState('Morning Batch (8:30 AM - 10:30 AM)');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('patron@okhdfcbank');
  const [notes, setNotes] = useState('');
  
  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<string>('WELCOME50');
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCartOpen) return null;

  // Pricing calculations in INR (₹)
  const freeDeliveryThreshold = 500;
  const deliveryFee = deliveryType === 'delivery' ? (cartSubtotal >= freeDeliveryThreshold ? 0 : 50) : 0;
  const packagingFee = 20;

  // Coupon discount calculation
  let discount = 0;
  const couponDef = AVAILABLE_COUPONS.find(c => c.code === appliedCoupon);
  if (couponDef && cartSubtotal >= couponDef.minOrder) {
    if (couponDef.discountType === 'fixed') {
      discount = couponDef.value;
    } else {
      discount = Math.round((cartSubtotal * couponDef.value) / 100);
    }
  }

  const finalTotal = Math.max(0, cartSubtotal + deliveryFee + packagingFee - discount);
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);

  const applyCouponCode = (code: string) => {
    const target = AVAILABLE_COUPONS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!target) {
      setCouponError('Invalid coupon code.');
      return;
    }
    if (cartSubtotal < target.minOrder) {
      setCouponError(`Min order value of ₹${target.minOrder} required for ${target.code}.`);
      return;
    }
    setAppliedCoupon(target.code);
    setCouponError('');
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!customerName || !customerPhone) {
      alert('Please fill in your name and phone number.');
      return;
    }

    if (deliveryType === 'delivery' && !deliveryAddress) {
      alert('Please provide your delivery address.');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate bank gateway latency
      await new Promise(r => setTimeout(r, 1200));

      const newOrder = await placeOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || 'customer@example.com',
        deliveryType,
        deliveryAddress: deliveryType === 'delivery' ? `${deliveryAddress}, Pin: ${pincode}` : undefined,
        slot,
        paymentMethod,
        notes,
        couponCode: appliedCoupon || undefined,
        discount,
        deliveryFee,
        packagingFee
      });

      setIsProcessing(false);
      setIsCartOpen(false);
      setStep('cart');
      setTrackingOrderId(newOrder.id);
      setActiveTab('tracking');
    } catch (err) {
      setIsProcessing(false);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200 animate-in slide-in-from-right duration-300"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-[#FAF8F5]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900">
              <span>Hearth & Crumb</span>
              <span aria-hidden="true">·</span>
              <span>{step === 'cart' ? 'Shopping Bag' : 'Secure Checkout'}</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900 mt-0.5">
              {step === 'cart' ? `Your Selection (${cart.length})` : 'Finalize Your Order'}
            </h3>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Delivery Bar (Cart view) */}
        {step === 'cart' && deliveryType === 'delivery' && (
          <div className="px-6 py-2.5 bg-amber-50/70 border-b border-amber-200/60 text-xs text-amber-950 flex items-center justify-between">
            {amountNeededForFreeDelivery > 0 ? (
              <span>Add <strong className="tabular-nums">₹{amountNeededForFreeDelivery}</strong> more for Free Delivery!</span>
            ) : (
              <span className="font-semibold text-emerald-800 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Unlocked Free Express Delivery in Mumbai!
              </span>
            )}
            <span className="text-[11px] text-amber-800 tabular-nums">Threshold: ₹500</span>
          </div>
        )}

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
                <Banknote className="w-6 h-6" />
              </div>
              <p className="font-serif text-xl font-semibold text-stone-800">
                Your bread bag is empty
              </p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore our daily morning sourdoughs, croissants, and dessert cakes fresh from the oven deck.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-4 py-2 bg-amber-900 text-stone-50 text-xs font-semibold rounded-lg hover:bg-amber-800 transition-colors cursor-pointer"
              >
                Browse Today's Catalog
              </button>
            </div>
          ) : step === 'cart' ? (
            /* STEP 1: CART ITEMS */
            <div className="space-y-4">
              {cart.map(item => (
                <div
                  key={item.menuItem.id}
                  className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200/80"
                >
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-cover rounded-lg bg-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm font-semibold text-stone-900 truncate">
                      {item.menuItem.name}
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      ₹{item.menuItem.price} each · {item.menuItem.weightOrServing}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      {/* Stepper */}
                      <div className="flex items-center gap-1.5 bg-white px-2 py-0.5 rounded border border-stone-200">
                        <button
                          onClick={() => updateCartQuantity(item.menuItem.id, -1)}
                          className="text-stone-600 hover:text-stone-900 p-0.5 cursor-pointer"
                          title="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold text-stone-900 tabular-nums min-w-[16px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.menuItem.id, 1)}
                          disabled={item.quantity >= item.menuItem.stock}
                          className="text-stone-600 hover:text-stone-900 p-0.5 disabled:opacity-30 cursor-pointer"
                          title="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right">
                        <span className="text-xs font-bold text-stone-900 tabular-nums">
                          ₹{item.menuItem.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.menuItem.id)}
                    className="text-stone-400 hover:text-red-700 p-1 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Order mode switch in cart */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-stone-700 block mb-2">
                  Order Fulfillment
                </span>
                <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-lg">
                  <button
                    onClick={() => setDeliveryType('delivery')}
                    className={`py-2 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      deliveryType === 'delivery'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-800" />
                    <span>Doorstep Delivery</span>
                  </button>
                  <button
                    onClick={() => setDeliveryType('pickup')}
                    className={`py-2 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      deliveryType === 'pickup'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-800" />
                    <span>Bakery Pickup</span>
                  </button>
                </div>
                {deliveryType === 'pickup' && (
                  <p className="text-[11px] text-stone-500 mt-1.5">
                    Pickup Counter: Hearth & Crumb, Shop 4, Colaba Causeway, Mumbai 400005. Ready within 20 mins.
                  </p>
                )}
              </div>

              {/* Available Coupons Shortcut */}
              <div className="pt-2">
                <div className="flex items-center gap-1 text-xs font-semibold text-stone-700 mb-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-700" />
                  <span>Bakery Offers</span>
                </div>
                <div className="space-y-1.5">
                  {AVAILABLE_COUPONS.map(c => (
                    <div 
                      key={c.code}
                      onClick={() => applyCouponCode(c.code)}
                      className={`p-2 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                        appliedCoupon === c.code
                          ? 'bg-amber-50/80 border-amber-300 text-amber-950 font-medium'
                          : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-600'
                      }`}
                    >
                      <div>
                        <span className="font-mono font-bold text-amber-900">{c.code}</span>
                        <span className="ml-2 text-[11px]">{c.label}</span>
                      </div>
                      <span className="text-[11px] text-amber-800 underline">
                        {appliedCoupon === c.code ? 'Applied ✓' : 'Apply'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* STEP 2: CHECKOUT FORM */
            <form onSubmit={handleCheckoutSubmit} id="checkout-form" className="space-y-4">
              
              {/* Back to Cart link */}
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="text-xs text-amber-900 hover:underline font-semibold flex items-center gap-1 cursor-pointer mb-2"
              >
                ← Edit items in shopping bag
              </button>

              {/* Customer Contact */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  1. Contact Information
                </h4>
                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Radhika Apte"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:border-amber-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      Mobile Number (+91) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="98201 00000"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:border-amber-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      Email (for receipt)
                    </label>
                    <input
                      type="email"
                      placeholder="patron@gmail.com"
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:border-amber-900"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address if delivery */}
              {deliveryType === 'delivery' && (
                <div className="space-y-3 pt-2 border-t border-stone-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                    2. Mumbai Delivery Address
                  </h4>
                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      Street / Apartment / Landmark *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Flat 502, Sterling Apts, Worli / Bandra / Colaba..."
                      value={deliveryAddress}
                      onChange={e => setDeliveryAddress(e.target.value)}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:border-amber-900 resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium text-stone-700 block mb-1">
                        Pincode
                      </label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={e => setPincode(e.target.value)}
                        className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:border-amber-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-stone-700 block mb-1">
                        Delivery Slot
                      </label>
                      <select
                        value={slot}
                        onChange={e => setSlot(e.target.value)}
                        className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:border-amber-900"
                      >
                        <option>Morning Batch (8:30 AM - 10:30 AM)</option>
                        <option>Noon Batch (12:00 PM - 2:00 PM)</option>
                        <option>Afternoon Tea (3:30 PM - 5:30 PM)</option>
                        <option>Evening Drop (6:30 PM - 8:30 PM)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Methods (Indian Currency ₹) */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  3. Indian Rupee (₹) Payment Method
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  {/* UPI */}
                  <label
                    className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-amber-900 bg-amber-50/60 ring-1 ring-amber-900'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <QrCode className="w-4 h-4 text-amber-800" />
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="accent-amber-900"
                      />
                    </div>
                    <div className="mt-2">
                      <span className="text-xs font-bold text-stone-900 block">Instant UPI</span>
                      <span className="text-[10px] text-stone-500">GPay, PhonePe, Paytm</span>
                    </div>
                  </label>

                  {/* Card */}
                  <label
                    className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-amber-900 bg-amber-50/60 ring-1 ring-amber-900'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <CreditCard className="w-4 h-4 text-amber-800" />
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="accent-amber-900"
                      />
                    </div>
                    <div className="mt-2">
                      <span className="text-xs font-bold text-stone-900 block">Debit / Credit Card</span>
                      <span className="text-[10px] text-stone-500">RuPay, Visa, MC</span>
                    </div>
                  </label>

                  {/* NetBanking */}
                  <label
                    className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'border-amber-900 bg-amber-50/60 ring-1 ring-amber-900'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Building className="w-4 h-4 text-amber-800" />
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'netbanking'}
                        onChange={() => setPaymentMethod('netbanking')}
                        className="accent-amber-900"
                      />
                    </div>
                    <div className="mt-2">
                      <span className="text-xs font-bold text-stone-900 block">Net Banking</span>
                      <span className="text-[10px] text-stone-500">HDFC, SBI, ICICI</span>
                    </div>
                  </label>

                  {/* Cash on Delivery / Counter */}
                  <label
                    className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-amber-900 bg-amber-50/60 ring-1 ring-amber-900'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Banknote className="w-4 h-4 text-amber-800" />
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-amber-900"
                      />
                    </div>
                    <div className="mt-2">
                      <span className="text-xs font-bold text-stone-900 block">
                        {deliveryType === 'delivery' ? 'Cash on Delivery' : 'Pay at Counter'}
                      </span>
                      <span className="text-[10px] text-stone-500">Pay when fresh loaves arrive</span>
                    </div>
                  </label>
                </div>

                {/* Sub-inputs for selected payment method */}
                {paymentMethod === 'upi' && (
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-800">Bakery VPA ID:</span>
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-stone-300 text-amber-900">
                        hearthcrumb@okhdfcbank
                      </span>
                    </div>
                    <div>
                      <label className="text-[11px] text-stone-600 block mb-0.5">Your UPI ID</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={e => setUpiId(e.target.value)}
                        placeholder="yourname@oksbi"
                        className="w-full p-2 bg-white border border-stone-200 rounded text-xs text-stone-900"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-2">
                    <div>
                      <label className="text-[11px] text-stone-600 block mb-0.5">Card Number</label>
                      <input
                        type="text"
                        defaultValue="4111 2222 3333 4444"
                        placeholder="16-digit card number"
                        className="w-full p-2 bg-white border border-stone-200 rounded text-xs font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        defaultValue="08/29"
                        placeholder="MM/YY"
                        className="p-2 bg-white border border-stone-200 rounded text-xs font-mono"
                      />
                      <input
                        type="password"
                        defaultValue="892"
                        placeholder="CVV"
                        maxLength={3}
                        className="p-2 bg-white border border-stone-200 rounded text-xs font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Special Instructions */}
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  Baking or Delivery Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sliced sourdough please / Ring bell softly"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800"
                />
              </div>

            </form>
          )}
        </div>

        {/* Drawer Footer: Bill Summary & Proceed Action */}
        {cart.length > 0 && (
          <div className="p-6 bg-[#FAF8F5] border-t border-stone-200 space-y-3">
            
            {/* Price Breakdown in INR (₹) */}
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="tabular-nums font-medium text-stone-900">₹{cartSubtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="tabular-nums">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Artisan Kraft Packaging</span>
                <span className="tabular-nums">₹{packagingFee}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-800 font-medium">
                  <span>Bakery Discount ({appliedCoupon})</span>
                  <span className="tabular-nums">-₹{discount}</span>
                </div>
              )}

              <div className="pt-2 border-t border-stone-200/80 flex justify-between items-baseline text-stone-900">
                <span className="font-semibold text-sm">Total Payable</span>
                <span className="font-serif text-2xl font-bold text-amber-900 tabular-nums">
                  ₹{finalTotal}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            {step === 'cart' ? (
              <button
                onClick={() => setStep('checkout')}
                className="w-full py-3.5 bg-amber-900 hover:bg-amber-800 text-stone-50 text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4 text-amber-200" />
              </button>
            ) : (
              <button
                type="submit"
                form="checkout-form"
                disabled={isProcessing}
                className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-stone-50 text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <span>Securing Order & Firing Hearth Ovens...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>Confirm Order · Pay ₹{finalTotal}</span>
                  </>
                )}
              </button>
            )}

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
              <span>256-bit Encrypted · FSSAI Certified Neighborhood Bakery</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
