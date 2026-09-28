export type DietaryPreference = 'Eggless' | 'Contains Egg' | 'Vegan' | 'Gluten-Free';

export type Category = 
  | 'All Bakes'
  | 'Sourdough & Breads'
  | 'Viennoiserie & Pastries'
  | 'Cakes & Desserts'
  | 'Savory Bakes'
  | 'Beverages & Brews';

export interface MenuItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: 'Sourdough & Breads' | 'Viennoiserie & Pastries' | 'Cakes & Desserts' | 'Savory Bakes' | 'Beverages & Brews';
  price: number; // in INR (₹)
  image: string;
  stock: number; // real-time inventory count
  initialStock: number;
  dietary: DietaryPreference;
  freshBatchTime: string; // e.g. "Baked today at 7:15 AM"
  rating: number;
  reviewCount: number;
  isSpecialToday: boolean;
  ingredients: string[];
  allergens: string[];
  weightOrServing: string; // e.g., "550g loaf", "Single piece 120g"
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export interface CustomerReview {
  id: string;
  itemId?: string;
  itemName?: string;
  customerName: string;
  rating: number; // 1 to 5
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  tag?: string;
}

export type OrderStatus = 'placed' | 'baking' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface OrderTimelineStep {
  status: OrderStatus;
  label: string;
  time: string;
  done: boolean;
  description: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryType: 'delivery' | 'pickup';
  deliveryAddress?: string;
  slot: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  packagingFee: number;
  discount: number;
  couponCode?: string;
  total: number; // in INR (₹)
  paymentMethod: 'upi' | 'card' | 'cod' | 'netbanking';
  paymentStatus: 'paid' | 'pending';
  status: OrderStatus;
  placedAt: string;
  estimatedTime: string;
  notes?: string;
  timeline: OrderTimelineStep[];
}
