import React from 'react';
import { ArrowDown, Flame, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { BAKERY_HERO_IMAGE } from '../data/initialData';
import { useBakery } from '../context/BakeryContext';

export const HeroBanner: React.FC = () => {
  const { menuItems } = useBakery();
  
  // Real-time calculation of total loaves & pastries in stock right now
  const totalStockInOven = menuItems.reduce((acc, item) => acc + item.stock, 0);

  const scrollToMenu = () => {
    const el = document.getElementById('daily-menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden border-b border-stone-200/70 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Brand Story & Order CTA */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Live Oven Batch Notice (Unboxed clean metadata) */}
            <div className="flex items-center gap-2 text-xs font-medium text-stone-600">
              <span className="flex items-center gap-1 text-amber-800">
                <Flame className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                Hearth Deck Ovens Fired
              </span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>Morning Bake at 6:00 AM</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="tabular-nums font-semibold text-stone-900">{totalStockInOven} Fresh Bakes Left</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-stone-900 leading-[1.1] text-balance">
              Wild sourdough & French viennoiserie, pulled hot from the stone deck.
            </h1>

            {/* Description */}
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl">
              Slow 36-hour wild yeast fermentation, 84% fat churned butter, and unbleached grain flours. 
              Baked in limited small morning batches for our neighborhood patrons in Colaba & South Mumbai.
            </p>

            {/* Primary Action & Trust line */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={scrollToMenu}
                className="px-6 py-3.5 bg-amber-900 hover:bg-amber-800 active:scale-98 text-stone-50 font-medium text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Order Today's Fresh Batch</span>
                <ArrowDown className="w-4 h-4 text-amber-300" />
              </button>

              <div className="flex items-center gap-2 text-xs text-stone-500">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Zero preservatives · 100% natural wild starter</span>
              </div>
            </div>

            {/* Bakery Service Callouts (Unboxed metadata) */}
            <div className="pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-4 text-xs text-stone-600">
              <div>
                <p className="font-semibold text-stone-900">Baking Hours</p>
                <p className="mt-0.5 text-stone-500">7:00 AM – 8:00 PM</p>
              </div>
              <div>
                <p className="font-semibold text-stone-900">Delivery Radius</p>
                <p className="mt-0.5 text-stone-500">All South & Central Mumbai</p>
              </div>
              <div>
                <p className="font-semibold text-stone-900">Free Delivery</p>
                <p className="mt-0.5 text-stone-500">On all orders ₹500+</p>
              </div>
            </div>

          </div>

          {/* Right Column: High-Fidelity Hero Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-stone-100 shadow-md border border-stone-200/60">
              <img
                src={BAKERY_HERO_IMAGE}
                alt="Artisanal bakery wooden counter filled with freshly baked sourdough loaves and pastries"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-700 ease-out"
              />
              
              {/* Subtle scrim for card anchor */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent pointer-events-none" />

              {/* Floating Real-Time Card Overlay */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-stone-200/80 shadow-lg flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-amber-800 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Real-Time Kitchen Feed</span>
                  </div>
                  <p className="text-sm font-semibold text-stone-900 mt-0.5">
                    Batch #04 pulled fresh from oven decks
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-500 block">Pricing In</span>
                  <span className="text-sm font-semibold text-amber-900 tabular-nums">INR (₹)</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
