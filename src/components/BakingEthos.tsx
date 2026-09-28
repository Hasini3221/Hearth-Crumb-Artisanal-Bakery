import React from 'react';
import { Sparkles, Clock, Wheat, Flame } from 'lucide-react';
import { CARDAMOM_BUN_IMAGE } from '../data/initialData';

export const BakingEthos: React.FC = () => {
  return (
    <section id="baking-ethos" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-stone-200/80">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left: Image with craftsmanship detail */}
        <div className="lg:col-span-5 relative order-2 lg:order-1">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md bg-stone-100 border border-stone-200">
            <img
              src={CARDAMOM_BUN_IMAGE}
              alt="Artisanal pastry dough twisting with cardamom and butter"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[10px] uppercase tracking-wider text-amber-300 font-semibold block">
                Stone Deck Ovens
              </span>
              <p className="font-serif text-lg font-semibold">
                Deck temperatures calibrated to 240°C with direct steam injection
              </p>
            </div>
          </div>
        </div>

        {/* Right: Editorial Story */}
        <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1">
              <span>Baking Ethos</span>
              <span aria-hidden="true">·</span>
              <span>South Mumbai Bakehouse</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
              Patience, Wild Yeasts, & Pure Churned Butter
            </h2>
          </div>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            We reject commercial dough conditioners, artificial colorants, and speed-baking enzymes. 
            Our mother starter named <em className="font-serif font-semibold text-stone-800">"Chandana"</em> has been 
            continuously fed every 8 hours since 2018.
          </p>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-white rounded-xl border border-stone-200/80 shadow-xs">
              <Wheat className="w-5 h-5 text-amber-700 mb-2" />
              <h4 className="font-serif font-semibold text-stone-900 text-base">Unbleached Grains</h4>
              <p className="text-xs text-stone-500 mt-1 leading-normal">
                Single-origin stoneground wheat and whole grains preserved with their natural germ.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200/80 shadow-xs">
              <Clock className="w-5 h-5 text-amber-700 mb-2" />
              <h4 className="font-serif font-semibold text-stone-900 text-base">36h Cold Proof</h4>
              <p className="text-xs text-stone-500 mt-1 leading-normal">
                Extended cold retardation transforms starches into digestible complex sugars and lactic notes.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200/80 shadow-xs">
              <Flame className="w-5 h-5 text-amber-700 mb-2" />
              <h4 className="font-serif font-semibold text-stone-900 text-base">Stone Deck Fire</h4>
              <p className="text-xs text-stone-500 mt-1 leading-normal">
                Direct stone contact yields blistered crusts, caramelized ears, and airy honeycomb crumbs.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
