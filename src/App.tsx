/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BakeryProvider, useBakery } from './context/BakeryContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MenuGallery } from './components/MenuGallery';
import { BakingEthos } from './components/BakingEthos';
import { CustomerReviewsSection } from './components/CustomerReviewsSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartCheckoutDrawer } from './components/CartCheckoutDrawer';
import { WriteReviewModal } from './components/WriteReviewModal';
import { OrderTrackingView } from './components/OrderTrackingView';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

const BakeryAppContent: React.FC = () => {
  const { activeTab } = useBakery();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar />

      {/* Main Page Area */}
      <main className="flex-1">
        {activeTab === 'store' && (
          <>
            <HeroBanner />
            <MenuGallery />
            <BakingEthos />
            <CustomerReviewsSection />
          </>
        )}

        {activeTab === 'tracking' && <OrderTrackingView />}

        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Overlays & Drawers */}
      <ProductDetailModal />
      <CartCheckoutDrawer />
      <WriteReviewModal />
    </div>
  );
};

export default function App() {
  return (
    <BakeryProvider>
      <BakeryAppContent />
    </BakeryProvider>
  );
}
