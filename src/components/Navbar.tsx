import React from 'react';
import { ShoppingBag, ChefHat, Search, Sparkles } from 'lucide-react';
import { useBakery } from '../context/BakeryContext';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    cartTotalCount, 
    setIsCartOpen,
    orders
  } = useBakery();

  const activeOrdersCount = orders.filter(
    o => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <button 
          onClick={() => setActiveTab('store')} 
          className="text-left group cursor-pointer focus-visible:outline-none"
        >
          <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 group-hover:text-amber-900 transition-colors">
            Hearth & Crumb
          </span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <button
            onClick={() => {
              setActiveTab('store');
              const el = document.getElementById('daily-menu');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`hover:text-amber-900 transition-colors cursor-pointer ${
              activeTab === 'store' ? 'text-stone-900 font-semibold' : ''
            }`}
          >
            Oven Gallery
          </button>
          
          <button
            onClick={() => {
              setActiveTab('store');
              const el = document.getElementById('baking-ethos');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-amber-900 transition-colors cursor-pointer"
          >
            Baking Ethos
          </button>

          <button
            onClick={() => {
              setActiveTab('store');
              const el = document.getElementById('patron-reviews');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-amber-900 transition-colors cursor-pointer"
          >
            Patron Reviews
          </button>

          <button
            onClick={() => setActiveTab('tracking')}
            className={`hover:text-amber-900 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tracking' ? 'text-amber-900 font-semibold' : ''
            }`}
          >
            <span>Live Order Tracking</span>
            {activeOrdersCount > 0 && (
              <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Admin toggle */}
          <button
            onClick={() => setActiveTab(activeTab === 'admin' ? 'store' : 'admin')}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-stone-900 text-stone-50 border-stone-900'
                : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400 hover:bg-stone-50'
            }`}
            title="Open Bakery Management Dashboard"
          >
            <ChefHat className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">
              {activeTab === 'admin' ? 'Back to Storefront' : 'Bakery Admin'}
            </span>
            <span className="sm:hidden">Admin</span>
          </button>

          {/* Shopping Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative px-4 py-2 text-xs font-semibold text-white bg-amber-900 rounded-lg hover:bg-amber-800 active:scale-98 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            aria-label="View shopping bag"
          >
            <ShoppingBag className="w-4 h-4 text-amber-200" />
            <span className="tabular-nums font-medium">Bag</span>
            {cartTotalCount > 0 && (
              <span className="ml-0.5 bg-amber-500 text-stone-950 text-[11px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                {cartTotalCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
