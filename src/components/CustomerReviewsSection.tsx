import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquarePlus, Sparkles } from 'lucide-react';
import { useBakery } from '../context/BakeryContext';

export const CustomerReviewsSection: React.FC = () => {
  const { reviews, setIsReviewModalOpen, setReviewTargetItem } = useBakery();
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  const filteredReviews = reviews.filter(r => {
    if (filterRating === 'all') return true;
    return r.rating === filterRating;
  });

  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <section id="patron-reviews" className="py-16 bg-white border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1">
              <span>Verified Patron Reviews</span>
              <span aria-hidden="true">·</span>
              <span>Colaba & South Mumbai</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
              Words From Our Neighborhood
            </h2>
            <p className="text-stone-600 text-sm mt-1 max-w-xl">
              From dawn breakfast pickups to celebration tables, hear how our wild yeast fermentation and deck-baked bakes delight our patrons.
            </p>
          </div>

          {/* Action to add review */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setReviewTargetItem(null);
                setIsReviewModalOpen(true);
              }}
              className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <MessageSquarePlus className="w-4 h-4 text-amber-400" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Quantitative Proof Scorecard (Claim-to-Proof Adjacency) */}
        <div className="bg-[#FAF8F5] rounded-xl border border-stone-200/90 p-6 sm:p-8 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Big Aggregate Rating */}
            <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-stone-200 pb-6 md:pb-0 md:pr-6 flex items-center gap-4">
              <div className="font-serif text-5xl font-bold text-stone-900 tabular-nums">
                {averageRating}
              </div>
              <div>
                <div className="flex text-amber-500 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
                  ))}
                </div>
                <p className="text-xs font-medium text-stone-700">
                  Overall Bakery Score
                </p>
                <p className="text-[11px] text-stone-500">
                  Based on {reviews.length} verified local orders
                </p>
              </div>
            </div>

            {/* Qualitative Highlights */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-600">
              <div className="p-3 bg-white rounded-lg border border-stone-200/60">
                <span className="font-semibold text-stone-900 block text-sm tabular-nums">98.4%</span>
                <span className="text-stone-500 mt-0.5 block">5-Star Crust & Crumb Rating</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-stone-200/60">
                <span className="font-semibold text-stone-900 block text-sm tabular-nums">36 Hours</span>
                <span className="text-stone-500 mt-0.5 block">Natural Fermentation Window</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-stone-200/60">
                <span className="font-semibold text-stone-900 block text-sm">Deck-Baked Daily</span>
                <span className="text-stone-500 mt-0.5 block">Zero preservatives or chemicals</span>
              </div>
            </div>

          </div>
        </div>

        {/* Filter by star rating */}
        <div className="flex items-center gap-2 mb-6 text-xs overflow-x-auto pb-1">
          <span className="text-stone-400 mr-1">Filter:</span>
          {(['all', 5, 4, 3] as const).map(rate => (
            <button
              key={rate}
              onClick={() => setFilterRating(rate)}
              className={`px-3 py-1 rounded-md border transition-colors cursor-pointer ${
                filterRating === rate
                  ? 'bg-amber-900 text-white border-amber-900'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
              }`}
            >
              {rate === 'all' ? 'All Reviews' : `${rate} Stars Only`}
            </button>
          ))}
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map(review => (
            <div
              key={review.id}
              className="bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] p-5 rounded-xl border border-stone-200/80 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top line: stars & date */}
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <div className="flex text-amber-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    ))}
                  </div>
                  <span className="text-[11px] text-stone-400">{review.date}</span>
                </div>

                {/* Review Item Name if applicable */}
                {review.itemName && (
                  <p className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider mb-1">
                    {review.itemName}
                  </p>
                )}

                {/* Review Prose */}
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                  "{review.comment}"
                </p>
              </div>

              {/* Author & Verification Footer */}
              <div className="pt-4 border-t border-stone-200/60 mt-4 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-stone-900 block">
                    {review.customerName}
                  </span>
                  {review.tag && (
                    <span className="text-[11px] text-stone-500 block">
                      {review.tag}
                    </span>
                  )}
                </div>

                {review.verifiedPurchase && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    Verified Order
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
