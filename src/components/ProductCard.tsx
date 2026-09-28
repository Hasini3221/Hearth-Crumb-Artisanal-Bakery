import React, { useState } from 'react';
import { Star, Plus, Minus, Check, AlertCircle, Sparkles } from 'lucide-react';
import { MenuItem } from '../types/bakery';
import { useBakery } from '../context/BakeryContext';

interface ProductCardProps {
  item: MenuItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const { cart, addToCart, updateCartQuantity, setSelectedProduct } = useBakery();
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const cartEntry = cart.find(c => c.menuItem.id === item.id);
  const inCartQty = cartEntry ? cartEntry.quantity : 0;
  const isOutOfStock = item.stock <= 0;
  const isLowStock = item.stock > 0 && item.stock <= 4;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const res = addToCart(item, 1);
    if (res.success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    }
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateCartQuantity(item.id, 1);
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateCartQuantity(item.id, -1);
  };

  return (
    <div
      onClick={() => setSelectedProduct(item)}
      className="group bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Image Container (65% visual weight, standard 4:3) */}
        <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
          {!imgError ? (
            <img
              src={item.image}
              alt={item.name}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 p-4 text-center">
              <span className="font-serif text-lg font-semibold text-stone-700">{item.name}</span>
              <span className="text-xs text-stone-400 mt-1">Artisanal Bakery</span>
            </div>
          )}

          {/* Fresh batch badge or special marker */}
          {item.isSpecialToday && (
            <div className="absolute top-3 left-3 bg-stone-900/90 backdrop-blur-xs text-stone-50 text-[11px] font-medium px-2 py-0.5 rounded shadow-sm">
              Today's Special
            </div>
          )}

          {/* Real-time stock status badge */}
          <div className="absolute top-3 right-3">
            {isOutOfStock ? (
              <span className="bg-stone-800 text-stone-100 text-[11px] font-semibold px-2 py-0.5 rounded shadow-sm">
                Sold Out
              </span>
            ) : isLowStock ? (
              <span className="bg-amber-700 text-amber-50 text-[11px] font-semibold px-2 py-0.5 rounded shadow-sm flex items-center gap-1 animate-pulse">
                <AlertCircle className="w-3 h-3" />
                Only {item.stock} left
              </span>
            ) : (
              <span className="bg-stone-900/80 backdrop-blur-xs text-stone-200 text-[11px] font-medium px-2 py-0.5 rounded shadow-sm tabular-nums">
                {item.stock} in batch
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-5">
          {/* Metadata unboxed text */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="uppercase tracking-wider font-semibold text-[10px] text-amber-900">
              {item.category}
            </span>
            <span>{item.dietary}</span>
          </div>

          {/* Product Title */}
          <h3 className="font-serif text-lg sm:text-xl font-semibold text-stone-900 leading-snug group-hover:text-amber-900 transition-colors">
            {item.name}
          </h3>

          {/* Tagline / Subtitle */}
          <p className="text-stone-500 text-xs mt-1 line-clamp-2 leading-relaxed">
            {item.tagline}
          </p>

          {/* Rating & Batch Timing */}
          <div className="mt-3 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 pt-2.5">
            <div className="flex items-center gap-1 text-stone-800 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span className="tabular-nums">{item.rating}</span>
              <span className="text-stone-400 font-normal">({item.reviewCount})</span>
            </div>
            <span className="text-[11px] text-stone-400 truncate max-w-[130px]">
              {item.freshBatchTime}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer: Price & Interactive Action */}
      <div className="p-4 sm:p-5 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-stone-400 block">Price</span>
          <span className="font-serif text-lg font-bold text-stone-900 tabular-nums">
            ₹{item.price}
          </span>
        </div>

        {/* Interactive Buy Control */}
        <div>
          {isOutOfStock ? (
            <button
              disabled
              className="px-3.5 py-1.5 text-xs font-medium text-stone-400 bg-stone-100 rounded-lg cursor-not-allowed"
            >
              Sold Out
            </button>
          ) : inCartQty > 0 ? (
            <div 
              onClick={e => e.stopPropagation()} 
              className="flex items-center gap-2 bg-stone-100 rounded-lg p-1 border border-stone-200"
            >
              <button
                onClick={handleDecrease}
                className="w-6 h-6 flex items-center justify-center rounded bg-white hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer"
                title="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-semibold text-stone-900 tabular-nums min-w-[18px] text-center">
                {inCartQty}
              </span>
              <button
                onClick={handleIncrease}
                disabled={inCartQty >= item.stock}
                className="w-6 h-6 flex items-center justify-center rounded bg-white hover:bg-stone-200 text-stone-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                justAdded
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-900 hover:bg-amber-900 text-white'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
