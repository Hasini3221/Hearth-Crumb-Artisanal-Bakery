import React, { useState } from 'react';
import { X, Star, ShieldCheck, Flame, Plus, Minus, AlertCircle, MessageSquarePlus } from 'lucide-react';
import { useBakery } from '../context/BakeryContext';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    addToCart, 
    cart, 
    updateCartQuantity,
    reviews,
    setReviewTargetItem,
    setIsReviewModalOpen
  } = useBakery();

  const [qty, setQty] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!selectedProduct) return null;

  const inCartEntry = cart.find(c => c.menuItem.id === selectedProduct.id);
  const currentInCart = inCartEntry ? inCartEntry.quantity : 0;
  const isOutOfStock = selectedProduct.stock <= 0;
  const itemReviews = reviews.filter(r => r.itemId === selectedProduct.id);

  const handleAdd = () => {
    if (isOutOfStock) return;
    const res = addToCart(selectedProduct, qty);
    if (res.success) {
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 1500);
    }
  };

  const openReviewModal = () => {
    setReviewTargetItem(selectedProduct);
    setIsReviewModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left: Product Image & Badges */}
          <div className="md:col-span-6 relative bg-stone-100 min-h-[260px] md:min-h-full">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none md:hidden" />
            
            <div className="absolute bottom-3 left-3 right-3 md:top-3 md:left-3 md:right-auto flex items-center gap-2">
              <span className="bg-stone-900/90 text-stone-100 text-xs px-2.5 py-1 rounded backdrop-blur-xs font-medium">
                {selectedProduct.category}
              </span>
              <span className="bg-white/90 text-stone-900 text-xs px-2 py-1 rounded backdrop-blur-xs font-medium">
                {selectedProduct.dietary}
              </span>
            </div>
          </div>

          {/* Right: Contiguous Purchase Module */}
          <div className="md:col-span-6 p-6 sm:p-7 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Freshness & Stock Notice */}
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                <span className="flex items-center gap-1 text-amber-800 font-medium">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  {selectedProduct.freshBatchTime}
                </span>

                {isOutOfStock ? (
                  <span className="text-red-700 font-semibold">Sold Out</span>
                ) : (
                  <span className="text-stone-700 font-medium tabular-nums">
                    {selectedProduct.stock} left in batch
                  </span>
                )}
              </div>

              {/* Title & Serving */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
                {selectedProduct.name}
              </h2>
              <p className="text-xs text-amber-900 font-medium mt-1">
                {selectedProduct.weightOrServing}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-stone-900 font-semibold text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span className="tabular-nums">{selectedProduct.rating}</span>
                </div>
                <span className="text-xs text-stone-400">·</span>
                <span className="text-xs text-stone-500">{selectedProduct.reviewCount} customer reviews</span>
              </div>

              {/* Description */}
              <p className="text-stone-600 text-sm mt-4 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Ingredients & Allergens */}
              <div className="mt-5 pt-4 border-t border-stone-100 space-y-3">
                <div>
                  <h4 className="text-[11px] uppercase tracking-wider font-semibold text-stone-500">
                    Artisanal Ingredients
                  </h4>
                  <p className="text-xs text-stone-700 mt-1 leading-normal">
                    {selectedProduct.ingredients.join(', ')}
                  </p>
                </div>

                {selectedProduct.allergens.length > 0 && (
                  <div>
                    <h4 className="text-[11px] uppercase tracking-wider font-semibold text-amber-900">
                      Allergen Advisory
                    </h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Contains: {selectedProduct.allergens.join(', ')}
                    </p>
                  </div>
                )}
              </div>

              {/* Verified Item Reviews preview */}
              <div className="mt-5 pt-4 border-t border-stone-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[11px] uppercase tracking-wider font-semibold text-stone-500">
                    Recent Patron Reviews ({itemReviews.length})
                  </h4>
                  <button
                    onClick={openReviewModal}
                    className="text-xs text-amber-900 hover:text-amber-800 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    <span>Review This Bake</span>
                  </button>
                </div>

                {itemReviews.length > 0 ? (
                  <div className="space-y-2">
                    {itemReviews.slice(0, 2).map(r => (
                      <div key={r.id} className="bg-stone-50 p-2.5 rounded-lg border border-stone-100 text-xs">
                        <div className="flex items-center justify-between text-stone-800 font-medium">
                          <span>{r.customerName}</span>
                          <div className="flex text-amber-500">
                            {'★'.repeat(r.rating)}
                          </div>
                        </div>
                        <p className="text-stone-600 text-[11px] mt-1 line-clamp-2">
                          "{r.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-400 italic">
                    Be the first patron to review today's batch of this bake!
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Buy Bar */}
            <div className="mt-6 pt-4 border-t border-stone-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[11px] text-stone-400 block">Total Price</span>
                  <span className="font-serif text-2xl font-bold text-stone-900 tabular-nums">
                    ₹{selectedProduct.price * qty}
                  </span>
                </div>

                {/* Quantity selector */}
                {!isOutOfStock && (
                  <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-lg border border-stone-200">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-7 h-7 flex items-center justify-center rounded bg-white hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer"
                      title="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-semibold text-stone-900 tabular-nums min-w-[24px] text-center">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(Math.min(selectedProduct.stock, qty + 1))}
                      disabled={qty >= selectedProduct.stock}
                      className="w-7 h-7 flex items-center justify-center rounded bg-white hover:bg-stone-200 text-stone-800 transition-colors disabled:opacity-40 cursor-pointer"
                      title="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Action Button */}
              {isOutOfStock ? (
                <button
                  disabled
                  className="w-full py-3 bg-stone-200 text-stone-400 font-medium rounded-lg text-sm cursor-not-allowed text-center"
                >
                  Sold Out for Today's Batch
                </button>
              ) : (
                <button
                  onClick={handleAdd}
                  className={`w-full py-3 text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    addedNotice
                      ? 'bg-emerald-700 text-white'
                      : 'bg-amber-900 hover:bg-amber-800 text-white'
                  }`}
                >
                  {addedNotice ? (
                    <span>Added {qty} to Shopping Bag!</span>
                  ) : (
                    <span>Add {qty} to Bag · ₹{selectedProduct.price * qty}</span>
                  )}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
