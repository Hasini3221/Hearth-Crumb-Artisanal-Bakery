import React from 'react';
import { MapPin, Phone, Mail, Clock, Heart } from 'lucide-react';
import { useBakery } from '../context/BakeryContext';

export const Footer: React.FC = () => {
  const { setActiveTab } = useBakery();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-stone-800">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-serif text-2xl font-bold text-stone-100 tracking-tight block">
              Hearth & Crumb
            </span>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Artisanal neighborhood bakehouse and sourdough deck. 
              Naturally fermented wild sourdoughs, pure Normandy butter viennoiserie, 
              and seasonal cakes baked fresh every morning in South Mumbai.
            </p>
            <div className="text-xs text-stone-500 space-y-1">
              <p>FSSAI Lic. No: 11522001000842</p>
              <p>All prices listed in Indian National Rupees (₹ INR)</p>
            </div>
          </div>

          {/* Bakery Hours & Location */}
          <div className="md:col-span-4 space-y-3 text-xs">
            <h4 className="font-semibold text-stone-100 uppercase tracking-wider text-[11px]">
              Bakehouse & Counter
            </h4>
            <div className="flex items-start gap-2 text-stone-400">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                Shop No. 4, Ground Floor, Heritage Arcade, Colaba Causeway, Mumbai 400005.
              </span>
            </div>
            <div className="flex items-center gap-2 text-stone-400">
              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Tuesday – Sunday: 7:00 AM – 8:30 PM (Mondays Closed)</span>
            </div>
            <div className="flex items-center gap-2 text-stone-400">
              <Phone className="w-4 h-4 text-amber-500 shrink-0" />
              <span>+91 98201 44829 / 022 2288 4190</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2 text-xs">
            <h4 className="font-semibold text-stone-100 uppercase tracking-wider text-[11px] mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('store');
                    const el = document.getElementById('daily-menu');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Daily Fresh Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('store');
                    const el = document.getElementById('patron-reviews');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Patron Reviews
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('tracking')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Live Order Tracker
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('admin')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-amber-300 font-medium"
                >
                  Bakery Admin Portal →
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Quiet Bottom Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Hearth & Crumb Artisanal Bakehouse. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Hand-shaped & deck-baked with passion in Mumbai</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
