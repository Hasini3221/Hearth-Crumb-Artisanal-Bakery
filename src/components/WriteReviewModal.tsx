import React, { useState } from 'react';
import { X, Star, Check } from 'lucide-react';
import { useBakery } from '../context/BakeryContext';

export const WriteReviewModal: React.FC = () => {
  const {
    isReviewModalOpen,
    setIsReviewModalOpen,
    reviewTargetItem,
    setReviewTargetItem,
    menuItems,
    addReview
  } = useBakery();

  const [selectedItemId, setSelectedItemId] = useState<string>(reviewTargetItem ? reviewTargetItem.id : '');
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [tag, setTag] = useState('Neighborhood Patron');
  const [submitted, setSubmitted] = useState(false);

  if (!isReviewModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) return;

    const item = menuItems.find(m => m.id === selectedItemId);

    addReview({
      itemId: selectedItemId || undefined,
      itemName: item ? item.name : 'Overall Bakery Experience',
      customerName: customerName.trim(),
      rating,
      comment: comment.trim(),
      tag
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsReviewModalOpen(false);
      setReviewTargetItem(null);
      setComment('');
      setCustomerName('');
    }, 1200);
  };

  const handleClose = () => {
    setIsReviewModalOpen(false);
    setReviewTargetItem(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-900 block">
            Patron Feedback
          </span>
          <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">
            Share Your Bakery Experience
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Your review helps our master bakers fine-tune each daily batch.
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-xl font-semibold text-stone-900">
              Thank you for the warm words!
            </h4>
            <p className="text-xs text-stone-600">
              Your review is now published to the bakery community feed.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Star Rating Selector */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-2xl transition-transform hover:scale-110 cursor-pointer focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-medium text-stone-600 ml-2">
                  {rating === 5 ? 'Exceptional (5/5)' : rating === 4 ? 'Very Good (4/5)' : `${rating}/5`}
                </span>
              </div>
            </div>

            {/* Item selector */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Baked Item Reviewed
              </label>
              <select
                value={selectedItemId}
                onChange={e => setSelectedItemId(e.target.value)}
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:border-amber-900"
              >
                <option value="">General Bakery & Ambience</option>
                {menuItems.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Name */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Shalini Nair"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:border-amber-900"
              />
            </div>

            {/* Tag / Persona */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Patron Tag
              </label>
              <select
                value={tag}
                onChange={e => setTag(e.target.value)}
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:border-amber-900"
              >
                <option value="Neighborhood Regular">Neighborhood Regular</option>
                <option value="Sourdough Enthusiast">Sourdough Enthusiast</option>
                <option value="Morning Coffee Patrons">Morning Coffee Patrons</option>
                <option value="Weekend Breakfast Order">Weekend Breakfast Order</option>
                <option value="Celebration Order">Celebration Order</option>
              </select>
            </div>

            {/* Comment */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Your Review
              </label>
              <textarea
                required
                rows={3}
                placeholder="Tell us about the crust, crumb, aroma, or delivery packaging..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:border-amber-900 resize-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-amber-900 hover:bg-amber-800 text-stone-50 font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Submit Review
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
