import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Flame, Sparkles, AlertCircle } from 'lucide-react';
import { Category, DietaryPreference, MenuItem } from '../types/bakery';
import { useBakery } from '../context/BakeryContext';
import { ProductCard } from './ProductCard';

const CATEGORIES: Category[] = [
  'All Bakes',
  'Sourdough & Breads',
  'Viennoiserie & Pastries',
  'Cakes & Desserts',
  'Savory Bakes',
  'Beverages & Brews'
];

export const MenuGallery: React.FC = () => {
  const { menuItems } = useBakery();
  
  const [selectedCategory, setSelectedCategory] = useState<Category>('All Bakes');
  const [dietaryFilter, setDietaryFilter] = useState<'All' | DietaryPreference>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlySpecials, setOnlySpecials] = useState(false);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      // Category filter
      if (selectedCategory !== 'All Bakes' && item.category !== selectedCategory) {
        return false;
      }
      // Dietary filter
      if (dietaryFilter !== 'All' && item.dietary !== dietaryFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesTag = item.tagline.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        if (!matchesName && !matchesTag && !matchesDesc) return false;
      }
      // In-stock only
      if (onlyInStock && item.stock <= 0) {
        return false;
      }
      // Specials only
      if (onlySpecials && !item.isSpecialToday) {
        return false;
      }
      return true;
    });
  }, [menuItems, selectedCategory, dietaryFilter, searchQuery, onlyInStock, onlySpecials]);

  const totalAvailableStock = menuItems.reduce((acc, it) => acc + it.stock, 0);

  return (
    <section id="daily-menu" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1">
            <span>Daily Oven Roster</span>
            <span aria-hidden="true">·</span>
            <span>Real-Time Inventory</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
            Fresh From The Hearth
          </h2>
          <p className="text-stone-600 text-sm mt-1 max-w-xl">
            Each batch is shaped and deck-baked in limited numbers. Quantities update instantly with every order.
          </p>
        </div>

        {/* Real-time stats callout */}
        <div className="flex items-center gap-4 text-xs text-stone-500 bg-white border border-stone-200/80 px-4 py-2.5 rounded-lg shadow-xs self-start md:self-auto">
          <div>
            <span className="text-stone-400 block text-[10px]">Oven Inventory</span>
            <span className="font-semibold text-stone-900 tabular-nums">
              {totalAvailableStock} items left
            </span>
          </div>
          <span className="w-px h-6 bg-stone-200" />
          <div>
            <span className="text-stone-400 block text-[10px]">Currency</span>
            <span className="font-semibold text-stone-900">Indian Rupee (₹)</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 mb-8">
        {/* Category Tabs (Interactive Segmented Control) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === category
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Secondary Filter Controls: Dietary & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Dietary selection */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs text-stone-400 mr-1 hidden sm:inline">Dietary:</span>
            {(['All', 'Eggless', 'Vegan', 'Contains Egg'] as const).map(diet => (
              <button
                key={diet}
                onClick={() => setDietaryFilter(diet)}
                className={`px-2.5 py-1 text-xs rounded-md border transition-colors whitespace-nowrap cursor-pointer ${
                  dietaryFilter === diet
                    ? 'border-stone-800 bg-stone-900 text-stone-100 font-medium'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                {diet}
              </button>
            ))}

            {/* Quick toggles */}
            <button
              onClick={() => setOnlyInStock(!onlyInStock)}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors whitespace-nowrap cursor-pointer ${
                onlyInStock
                  ? 'border-amber-800 bg-amber-900 text-amber-50 font-medium'
                  : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
              }`}
            >
              In-Stock Only
            </button>

            <button
              onClick={() => setOnlySpecials(!onlySpecials)}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors whitespace-nowrap cursor-pointer ${
                onlySpecials
                  ? 'border-amber-800 bg-amber-900 text-amber-50 font-medium'
                  : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
              }`}
            >
              Today's Specials
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search sourdough, tart, puff..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-900 focus:ring-1 focus:ring-amber-900 transition-colors"
            />
          </div>

        </div>
      </div>

      {/* Product Grid (3-column desktop, 2-column tablet) */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map(item => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center max-w-md mx-auto">
          <p className="font-serif text-xl font-semibold text-stone-800">
            No baked goods match this filter
          </p>
          <p className="text-xs text-stone-500 mt-2">
            Try resetting your dietary preference or search criteria to view our daily hearth catalog.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All Bakes');
              setDietaryFilter('All');
              setSearchQuery('');
              setOnlyInStock(false);
              setOnlySpecials(false);
            }}
            className="mt-4 px-4 py-2 bg-stone-900 text-stone-50 text-xs font-medium rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </section>
  );
};
