import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, CartItem, Order, CustomerReview, OrderStatus, OrderTimelineStep } from '../types/bakery';
import { INITIAL_MENU_ITEMS, INITIAL_ORDERS, INITIAL_REVIEWS } from '../data/initialData';

interface BakeryContextType {
  menuItems: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  reviews: CustomerReview[];
  activeTab: 'store' | 'admin' | 'tracking';
  setActiveTab: (tab: 'store' | 'admin' | 'tracking') => void;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedProduct: MenuItem | null;
  setSelectedProduct: (item: MenuItem | null) => void;
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  reviewTargetItem: MenuItem | null;
  setReviewTargetItem: (item: MenuItem | null) => void;
  
  // Cart Actions
  addToCart: (item: MenuItem, qty?: number) => { success: boolean; message?: string };
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => { success: boolean; message?: string };
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotal: number;

  // Ordering Actions
  placeOrder: (orderPayload: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryType: 'delivery' | 'pickup';
    deliveryAddress?: string;
    slot: string;
    paymentMethod: 'upi' | 'card' | 'cod' | 'netbanking';
    notes?: string;
    couponCode?: string;
    discount: number;
    deliveryFee: number;
    packagingFee: number;
  }) => Promise<Order>;

  // Admin Actions
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  updateItemStock: (itemId: string, newStock: number) => void;
  updateMenuItem: (item: MenuItem) => void;
  addMenuItem: (item: Omit<MenuItem, 'id' | 'rating' | 'reviewCount'>) => void;
  deleteMenuItem: (itemId: string) => void;
  
  // Customer Review Actions
  addReview: (review: {
    itemId?: string;
    itemName?: string;
    customerName: string;
    rating: number;
    comment: string;
    tag?: string;
  }) => void;
  
  // Reset demo data helper
  resetToDefaultData: () => void;
}

const BakeryContext = createContext<BakeryContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MENU: 'hearth_crumb_menu_v2',
  ORDERS: 'hearth_crumb_orders_v2',
  REVIEWS: 'hearth_crumb_reviews_v2',
  CART: 'hearth_crumb_cart_v2',
};

export const BakeryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial data from localStorage if available
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MENU);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_MENU_ITEMS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_ORDERS;
  });

  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_REVIEWS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<'store' | 'admin' | 'tracking'>('store');
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [reviewTargetItem, setReviewTargetItem] = useState<MenuItem | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
    } catch (e) {
      console.error(e);
    }
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Cart operations
  const addToCart = (item: MenuItem, qty: number = 1): { success: boolean; message?: string } => {
    // Check available real-time stock
    const currentMenuItem = menuItems.find(m => m.id === item.id) || item;
    const existingIndex = cart.findIndex(c => c.menuItem.id === item.id);
    const currentQtyInCart = existingIndex >= 0 ? cart[existingIndex].quantity : 0;

    if (currentMenuItem.stock <= 0) {
      return { success: false, message: `"${item.name}" is sold out for today's batch.` };
    }

    if (currentQtyInCart + qty > currentMenuItem.stock) {
      return { 
        success: false, 
        message: `Only ${currentMenuItem.stock} remaining in oven batch. You already have ${currentQtyInCart} in your bag.` 
      };
    }

    setCart(prev => {
      const idx = prev.findIndex(c => c.menuItem.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [...prev, { menuItem: currentMenuItem, quantity: qty }];
    });

    return { success: true };
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(c => c.menuItem.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, delta: number): { success: boolean; message?: string } => {
    const itemInMenu = menuItems.find(m => m.id === itemId);
    const existingItem = cart.find(c => c.menuItem.id === itemId);

    if (!existingItem) return { success: false };

    const newQty = existingItem.quantity + delta;

    if (newQty <= 0) {
      removeFromCart(itemId);
      return { success: true };
    }

    if (itemInMenu && newQty > itemInMenu.stock) {
      return {
        success: false,
        message: `Only ${itemInMenu.stock} available in today's fresh bake batch.`
      };
    }

    setCart(prev =>
      prev.map(c => (c.menuItem.id === itemId ? { ...c, quantity: newQty } : c))
    );
    return { success: true };
  };

  const clearCart = () => setCart([]);

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

  // Place Order with real-time stock deduction
  const placeOrder = async (payload: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryType: 'delivery' | 'pickup';
    deliveryAddress?: string;
    slot: string;
    paymentMethod: 'upi' | 'card' | 'cod' | 'netbanking';
    notes?: string;
    couponCode?: string;
    discount: number;
    deliveryFee: number;
    packagingFee: number;
  }): Promise<Order> => {
    const subtotal = cartSubtotal;
    const total = Math.max(0, subtotal + payload.deliveryFee + payload.packagingFee - payload.discount);
    const orderId = `HC-${Math.floor(1000 + Math.random() * 9000)}`;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const timeline: OrderTimelineStep[] = [
      {
        status: 'placed',
        label: 'Order Confirmed',
        time: timeString,
        done: true,
        description: `Order of ₹${total} received via ${payload.paymentMethod.toUpperCase()}. Sent to bakery station.`
      },
      {
        status: 'baking',
        label: 'Dough Proofed & Hearth Baking',
        time: 'In Progress',
        done: false,
        description: 'Bakers loading sourdough and pastries into stone deck ovens.'
      },
      {
        status: 'packed',
        label: 'Cooling & Artisanal Packing',
        time: 'Pending',
        done: false,
        description: 'Pastries resting on cooling racks, packed in eco-friendly kraft boxes.'
      },
      {
        status: 'out_for_delivery',
        label: payload.deliveryType === 'delivery' ? 'Out for Delivery' : 'Ready for Counter Pickup',
        time: 'Pending',
        done: false,
        description: payload.deliveryType === 'delivery' 
          ? 'Handed over to bakery temperature-controlled express runner.' 
          : 'Ready at front counter with order ID slip.'
      },
      {
        status: 'delivered',
        label: payload.deliveryType === 'delivery' ? 'Delivered Hot & Fresh' : 'Collected by Patron',
        time: 'Pending',
        done: false,
        description: 'Enjoy your fresh artisanal bakes!'
      }
    ];

    const newOrder: Order = {
      id: orderId,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      customerEmail: payload.customerEmail,
      deliveryType: payload.deliveryType,
      deliveryAddress: payload.deliveryAddress,
      slot: payload.slot,
      items: cart.map(c => ({
        id: c.menuItem.id,
        name: c.menuItem.name,
        price: c.menuItem.price,
        quantity: c.quantity,
        image: c.menuItem.image
      })),
      subtotal,
      deliveryFee: payload.deliveryFee,
      packagingFee: payload.packagingFee,
      discount: payload.discount,
      couponCode: payload.couponCode,
      total,
      paymentMethod: payload.paymentMethod,
      paymentStatus: payload.paymentMethod === 'cod' ? 'pending' : 'paid',
      status: 'placed',
      placedAt: `Today, ${timeString}`,
      estimatedTime: payload.deliveryType === 'delivery' ? '35-45 minutes' : 'Ready in 20 minutes',
      notes: payload.notes,
      timeline
    };

    // 1. Decrement real-time stock
    setMenuItems(prev =>
      prev.map(item => {
        const bought = cart.find(c => c.menuItem.id === item.id);
        if (bought) {
          const updatedStock = Math.max(0, item.stock - bought.quantity);
          return { ...item, stock: updatedStock };
        }
        return item;
      })
    );

    // 2. Add to orders
    setOrders(prev => [newOrder, ...prev]);

    // 3. Clear cart
    clearCart();

    return newOrder;
  };

  // Admin order status update
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const statusOrderSequence: OrderStatus[] = ['placed', 'baking', 'packed', 'out_for_delivery', 'delivered'];
    const targetIdx = statusOrderSequence.indexOf(newStatus);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order;

        const updatedTimeline = order.timeline.map((step) => {
          const stepIdx = statusOrderSequence.indexOf(step.status);
          const isDone = targetIdx >= 0 && stepIdx <= targetIdx;
          return {
            ...step,
            done: isDone,
            time: isDone && step.time === 'Pending' ? nowTime : step.time
          };
        });

        return {
          ...order,
          status: newStatus,
          timeline: updatedTimeline,
          paymentStatus: newStatus === 'delivered' ? 'paid' : order.paymentStatus
        };
      })
    );
  };

  // Admin stock adjustment
  const updateItemStock = (itemId: string, newStock: number) => {
    setMenuItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, stock: Math.max(0, newStock) } : item))
    );
  };

  // Admin menu editing
  const updateMenuItem = (updated: MenuItem) => {
    setMenuItems(prev => prev.map(item => (item.id === updated.id ? updated : item)));
  };

  // Admin add item
  const addMenuItem = (itemData: Omit<MenuItem, 'id' | 'rating' | 'reviewCount'>) => {
    const newItem: MenuItem = {
      ...itemData,
      id: `bake-${Date.now().toString().slice(-4)}`,
      rating: 5.0,
      reviewCount: 0
    };
    setMenuItems(prev => [newItem, ...prev]);
  };

  // Admin delete item
  const deleteMenuItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
    setCart(prev => prev.filter(c => c.menuItem.id !== itemId));
  };

  // Review submission
  const addReview = (newReviewData: {
    itemId?: string;
    itemName?: string;
    customerName: string;
    rating: number;
    comment: string;
    tag?: string;
  }) => {
    const newReview: CustomerReview = {
      id: `rev-${Date.now().toString().slice(-4)}`,
      itemId: newReviewData.itemId,
      itemName: newReviewData.itemName,
      customerName: newReviewData.customerName,
      rating: newReviewData.rating,
      comment: newReviewData.comment,
      date: 'Just now',
      verifiedPurchase: true,
      tag: newReviewData.tag || 'Verified Patron'
    };

    setReviews(prev => [newReview, ...prev]);

    // If attached to a specific item, update its rating and reviewCount
    if (newReviewData.itemId) {
      setMenuItems(prev =>
        prev.map(item => {
          if (item.id === newReviewData.itemId) {
            const newCount = item.reviewCount + 1;
            const newAvg = Number(
              ((item.rating * item.reviewCount + newReviewData.rating) / newCount).toFixed(1)
            );
            return { ...item, rating: newAvg, reviewCount: newCount };
          }
          return item;
        })
      );
    }
  };

  const resetToDefaultData = () => {
    setMenuItems(INITIAL_MENU_ITEMS);
    setOrders(INITIAL_ORDERS);
    setReviews(INITIAL_REVIEWS);
    setCart([]);
    localStorage.removeItem(STORAGE_KEYS.MENU);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.CART);
  };

  return (
    <BakeryContext.Provider
      value={{
        menuItems,
        cart,
        orders,
        reviews,
        activeTab,
        setActiveTab,
        trackingOrderId,
        setTrackingOrderId,
        isCartOpen,
        setIsCartOpen,
        selectedProduct,
        setSelectedProduct,
        isReviewModalOpen,
        setIsReviewModalOpen,
        reviewTargetItem,
        setReviewTargetItem,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotalCount,
        cartSubtotal,
        placeOrder,
        updateOrderStatus,
        updateItemStock,
        updateMenuItem,
        addMenuItem,
        deleteMenuItem,
        addReview,
        resetToDefaultData
      }}
    >
      {children}
    </BakeryContext.Provider>
  );
};

export const useBakery = (): BakeryContextType => {
  const context = useContext(BakeryContext);
  if (!context) {
    throw new Error('useBakery must be used within a BakeryProvider');
  }
  return context;
};
