import React, { useState } from 'react';
import { 
  Plus, Edit2, Trash2, CheckCircle2, Clock, 
  ShoppingBag, IndianRupee, AlertTriangle, ArrowUpRight, 
  Search, Eye, RefreshCw, Star, Flame, Filter, ChefHat
} from 'lucide-react';
import { useBakery } from '../context/BakeryContext';
import { MenuItem, Order, OrderStatus, Category, DietaryPreference } from '../types/bakery';
import { SOURDOUGH_IMAGE, CROISSANT_IMAGE, CARDAMOM_BUN_IMAGE, MANGO_CAKE_IMAGE } from '../data/initialData';

export const AdminDashboard: React.FC = () => {
  const { 
    orders, 
    menuItems, 
    reviews, 
    updateOrderStatus, 
    updateItemStock, 
    updateMenuItem, 
    addMenuItem, 
    deleteMenuItem,
    resetToDefaultData,
    setActiveTab,
    setTrackingOrderId
  } = useBakery();

  const [activeAdminTab, setActiveAdminTab] = useState<'orders' | 'inventory' | 'reviews'>('orders');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemTagline, setNewItemTagline] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<MenuItem['category']>('Sourdough & Breads');
  const [newItemPrice, setNewItemPrice] = useState<number>(250);
  const [newItemStock, setNewItemStock] = useState<number>(15);
  const [newItemDietary, setNewItemDietary] = useState<DietaryPreference>('Eggless');
  const [newItemServing, setNewItemServing] = useState('500g loaf');
  const [newItemImage, setNewItemImage] = useState<string>(SOURDOUGH_IMAGE);

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const totalOrdersCount = orders.length;
  const activeOrdersCount = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;
  const lowStockItems = menuItems.filter(item => item.stock > 0 && item.stock <= 4);
  const soldOutItems = menuItems.filter(item => item.stock === 0);

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    if (orderFilter !== 'all' && o.status !== orderFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.includes(q);
      if (!matchId && !matchName && !matchPhone) return false;
    }
    return true;
  });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    addMenuItem({
      name: newItemName.trim(),
      tagline: newItemTagline.trim() || 'Stone deck baked daily',
      description: newItemDesc.trim() || 'Handcrafted with natural wild yeast starter.',
      category: newItemCategory,
      price: Number(newItemPrice),
      image: newItemImage,
      stock: Number(newItemStock),
      initialStock: Number(newItemStock),
      dietary: newItemDietary,
      freshBatchTime: 'Out of oven just now',
      isSpecialToday: true,
      ingredients: ['Stoneground organic flour', 'Water', 'Sea salt', 'Wild starter'],
      allergens: ['Wheat (Gluten)'],
      weightOrServing: newItemServing
    });

    setIsAddModalOpen(false);
    // Reset inputs
    setNewItemName('');
    setNewItemTagline('');
    setNewItemDesc('');
    setNewItemPrice(250);
    setNewItemStock(15);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    updateMenuItem(editingItem);
    setEditingItem(null);
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1">
            <ChefHat className="w-4 h-4 text-amber-700" />
            <span>Bakery Head Chef Console</span>
            <span aria-hidden="true">·</span>
            <span>Colaba Hearth Operations</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Bakery Management & Orders
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time oven inventory control, order dispatch, and customer review moderation in Indian Currency (₹).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('store')}
            className="px-3.5 py-2 text-xs font-semibold bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-lg transition-colors cursor-pointer"
          >
            Preview Customer Storefront
          </button>
          <button
            onClick={() => {
              if (confirm('Reset demo orders, menu stock, and reviews to pristine factory state?')) {
                resetToDefaultData();
              }
            }}
            className="p-2 text-xs text-stone-500 hover:text-stone-800 bg-white border border-stone-200 rounded-lg transition-colors cursor-pointer"
            title="Reset Sample Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Metric Cards in Indian Currency (₹) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
        
        {/* Total Revenue in INR */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-stone-600">Total Revenue</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-800 font-bold text-xs">INR (₹)</span>
          </div>
          <p className="font-serif text-3xl font-bold text-stone-900 tabular-nums">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-emerald-700 font-medium block mt-1">
            From {orders.filter(o => o.paymentStatus === 'paid').length} settled orders
          </span>
        </div>

        {/* Active Kitchen Orders */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-stone-600">Active Hearth Orders</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-800 font-bold text-xs">Live</span>
          </div>
          <p className="font-serif text-3xl font-bold text-stone-900 tabular-nums">
            {activeOrdersCount}
          </p>
          <span className="text-[11px] text-stone-500 block mt-1">
            Baking, cooling, or out for delivery
          </span>
        </div>

        {/* Menu Catalog Count */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-stone-600">Daily Bakes Roster</span>
            <span className="p-1.5 rounded-lg bg-stone-100 text-stone-700 font-bold text-xs">Catalog</span>
          </div>
          <p className="font-serif text-3xl font-bold text-stone-900 tabular-nums">
            {menuItems.length} items
          </p>
          <span className="text-[11px] text-stone-500 block mt-1">
            {menuItems.reduce((acc, it) => acc + it.stock, 0)} total loaves & pastries in deck
          </span>
        </div>

        {/* Stock Alerts */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-stone-600">Low Stock Alerts</span>
            <span className="p-1.5 rounded-lg bg-red-50 text-red-800 font-bold text-xs">Notice</span>
          </div>
          <p className="font-serif text-3xl font-bold text-amber-900 tabular-nums">
            {lowStockItems.length + soldOutItems.length} items
          </p>
          <span className="text-[11px] text-amber-700 font-medium block mt-1">
            {soldOutItems.length} sold out, {lowStockItems.length} low batch
          </span>
        </div>

      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-stone-200 mb-6 pb-2">
        <button
          onClick={() => setActiveAdminTab('orders')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeAdminTab === 'orders'
              ? 'bg-amber-900 text-white'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Orders & Live Status Tracking ({orders.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('inventory')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeAdminTab === 'inventory'
              ? 'bg-amber-900 text-white'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Menu & Real-Time Stock ({menuItems.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('reviews')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeAdminTab === 'reviews'
              ? 'bg-amber-900 text-white'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Patron Reviews ({reviews.length})
        </button>
      </div>

      {/* TAB 1: ORDERS & LIVE STATUS DISPATCH */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-stone-200/80">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(['all', 'placed', 'baking', 'packed', 'out_for_delivery', 'delivered'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer capitalize ${
                    orderFilter === st
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {st.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            <div className="relative sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search Order # or Customer..."
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:border-amber-900"
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 border-b border-stone-200 uppercase text-[10px] tracking-wider text-stone-500 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Order ID & Date</th>
                    <th className="py-3 px-4">Customer & Contact</th>
                    <th className="py-3 px-4">Baked Items</th>
                    <th className="py-3 px-4">Amount (₹)</th>
                    <th className="py-3 px-4">Fulfillment</th>
                    <th className="py-3 px-4">Live Status Control</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-stone-400">
                        No orders match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                        
                        {/* ID & Date */}
                        <td className="py-3 px-4 font-mono font-bold text-stone-900">
                          #{order.id}
                          <span className="text-[11px] font-sans font-normal text-stone-500 block">
                            {order.placedAt}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="py-3 px-4">
                          <span className="font-semibold text-stone-900 block">{order.customerName}</span>
                          <span className="text-stone-500 text-[11px] block">{order.customerPhone}</span>
                        </td>

                        {/* Items */}
                        <td className="py-3 px-4 max-w-xs">
                          <span className="font-medium text-stone-800 line-clamp-2">
                            {order.items.map(it => `${it.quantity}x ${it.name}`).join(', ')}
                          </span>
                        </td>

                        {/* Total Amount in INR */}
                        <td className="py-3 px-4 tabular-nums">
                          <span className="font-bold text-amber-900 text-sm">
                            ₹{order.total}
                          </span>
                          <span className="text-[10px] text-stone-400 block uppercase">
                            {order.paymentMethod} · {order.paymentStatus}
                          </span>
                        </td>

                        {/* Fulfillment */}
                        <td className="py-3 px-4">
                          <span className="capitalize font-medium text-stone-800 block">
                            {order.deliveryType}
                          </span>
                          <span className="text-[10px] text-stone-500 block truncate max-w-[140px]">
                            {order.deliveryType === 'delivery' ? order.deliveryAddress : 'Counter Pickup'}
                          </span>
                        </td>

                        {/* Live Status Control Dropdown */}
                        <td className="py-3 px-4">
                          <select
                            value={order.status}
                            onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className={`p-1.5 rounded-lg border text-xs font-semibold focus:outline-none cursor-pointer ${
                              order.status === 'delivered'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : order.status === 'baking'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : order.status === 'packed'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : order.status === 'out_for_delivery'
                                ? 'bg-purple-50 text-purple-800 border-purple-300'
                                : 'bg-stone-100 text-stone-800 border-stone-300'
                            }`}
                          >
                            <option value="placed">Order Placed</option>
                            <option value="baking">Hearth Baking</option>
                            <option value="packed">Packed & Ready</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>

                        {/* View Tracking action */}
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setTrackingOrderId(order.id);
                              setActiveTab('tracking');
                            }}
                            className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md transition-colors inline-flex items-center gap-1 cursor-pointer"
                            title="Open Customer Live Tracking"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Track</span>
                          </button>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: MENU ITEMS & REAL-TIME STOCK */}
      {activeAdminTab === 'inventory' && (
        <div className="space-y-4">
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-stone-500">
              Adjust deck stock counts immediately. Changes synchronize with customer storefront in real time.
            </p>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 bg-amber-900 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Baked Good</span>
            </button>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 border-b border-stone-200 uppercase text-[10px] tracking-wider text-stone-500 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Baked Good</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price (₹ INR)</th>
                    <th className="py-3 px-4">Dietary</th>
                    <th className="py-3 px-4">Deck Stock (Real-Time)</th>
                    <th className="py-3 px-4">Quick Batch Top-Up</th>
                    <th className="py-3 px-4 text-right">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {menuItems.map(item => (
                    <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                      
                      {/* Name & Photo */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded-lg bg-stone-100 shrink-0"
                          />
                          <div>
                            <span className="font-serif font-bold text-stone-900 block text-sm">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-stone-400 block truncate max-w-xs">
                              {item.tagline}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 font-medium text-stone-800">
                        {item.category}
                      </td>

                      {/* Price in ₹ */}
                      <td className="py-3 px-4 font-bold text-stone-900 tabular-nums">
                        ₹{item.price}
                      </td>

                      {/* Dietary */}
                      <td className="py-3 px-4">
                        <span className="text-xs text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                          {item.dietary}
                        </span>
                      </td>

                      {/* Real-Time Stock Count */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={item.stock}
                            onChange={e => updateItemStock(item.id, parseInt(e.target.value) || 0)}
                            className={`w-16 p-1.5 border rounded text-xs font-bold text-center tabular-nums focus:outline-none focus:border-amber-900 ${
                              item.stock === 0
                                ? 'bg-red-50 border-red-300 text-red-900'
                                : item.stock <= 4
                                ? 'bg-amber-50 border-amber-300 text-amber-900'
                                : 'bg-white border-stone-300 text-stone-900'
                            }`}
                          />
                          <span className="text-[11px] text-stone-500">
                            {item.stock === 0 ? 'Sold Out' : item.stock <= 4 ? 'Low Stock' : 'In Deck'}
                          </span>
                        </div>
                      </td>

                      {/* Quick Restock Buttons */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateItemStock(item.id, item.stock + 6)}
                            className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[11px] font-medium transition-colors cursor-pointer"
                            title="Add small batch of 6"
                          >
                            +6 Batch
                          </button>
                          <button
                            onClick={() => updateItemStock(item.id, item.stock + 12)}
                            className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                            title="Add full deck batch of 12"
                          >
                            +12 Deck
                          </button>
                          <button
                            onClick={() => updateItemStock(item.id, 0)}
                            className="px-2 py-1 bg-stone-100 hover:bg-red-50 hover:text-red-700 text-stone-500 rounded text-[11px] transition-colors cursor-pointer"
                            title="Mark as Sold Out"
                          >
                            Zero
                          </button>
                        </div>
                      </td>

                      {/* Manage Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="p-1.5 text-stone-600 hover:text-amber-900 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                            title="Edit details & price"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove "${item.name}" from today's bakery menu?`)) {
                                deleteMenuItem(item.id);
                              }
                            }}
                            className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Delete item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: CUSTOMER REVIEWS FEED */}
      {activeAdminTab === 'reviews' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-stone-200/90 divide-y divide-stone-100 overflow-hidden shadow-xs">
            {reviews.map(rev => (
              <div key={rev.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-900">{rev.customerName}</span>
                    <span className="text-stone-300">·</span>
                    <span className="text-xs text-amber-900 font-medium">{rev.itemName || 'Bakery Experience'}</span>
                    <span className="text-stone-300">·</span>
                    <span className="text-[11px] text-stone-400">{rev.date}</span>
                  </div>

                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed max-w-2xl">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded font-medium">
                    Verified Customer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW MENU ITEM */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-1">
              Add New Oven Bake
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Add a new fresh loaf, viennoiserie, or seasonal pastry to the live menu.
            </p>

            <form onSubmit={handleCreateItem} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cinnamon Pecan Morning Roll"
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:border-amber-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Category *
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={e => setNewItemCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800"
                  >
                    <option value="Sourdough & Breads">Sourdough & Breads</option>
                    <option value="Viennoiserie & Pastries">Viennoiserie & Pastries</option>
                    <option value="Cakes & Desserts">Cakes & Desserts</option>
                    <option value="Savory Bakes">Savory Bakes</option>
                    <option value="Beverages & Brews">Beverages & Brews</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Price in INR (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="10"
                    value={newItemPrice}
                    onChange={e => setNewItemPrice(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 tabular-nums font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Initial Deck Stock *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newItemStock}
                    onChange={e => setNewItemStock(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 tabular-nums font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Dietary Classification
                  </label>
                  <select
                    value={newItemDietary}
                    onChange={e => setNewItemDietary(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800"
                  >
                    <option value="Eggless">Eggless</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Contains Egg">Contains Egg</option>
                    <option value="Gluten-Free">Gluten-Free</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rolled with Ceylon cinnamon & Madagascar vanilla"
                  value={newItemTagline}
                  onChange={e => setNewItemTagline(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell patrons about the dough lamination, fermentation, or deck baking..."
                  value={newItemDesc}
                  onChange={e => setNewItemDesc(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Publish to Menu (₹{newItemPrice})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT MENU ITEM */}
      {editingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-1">
              Edit "{editingItem.name}"
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Update pricing in INR (₹), real-time deck inventory, and descriptions.
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Price in INR (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editingItem.price}
                    onChange={e => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 font-semibold tabular-nums"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Current Deck Stock
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editingItem.stock}
                    onChange={e => setEditingItem({ ...editingItem, stock: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 font-semibold tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={e => setEditingItem({ ...editingItem, category: e.target.value as any })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800"
                  >
                    <option value="Sourdough & Breads">Sourdough & Breads</option>
                    <option value="Viennoiserie & Pastries">Viennoiserie & Pastries</option>
                    <option value="Cakes & Desserts">Cakes & Desserts</option>
                    <option value="Savory Bakes">Savory Bakes</option>
                    <option value="Beverages & Brews">Beverages & Brews</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Dietary Classification
                  </label>
                  <select
                    value={editingItem.dietary}
                    onChange={e => setEditingItem({ ...editingItem, dietary: e.target.value as any })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800"
                  >
                    <option value="Eggless">Eggless</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Contains Egg">Contains Egg</option>
                    <option value="Gluten-Free">Gluten-Free</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={editingItem.tagline}
                  onChange={e => setEditingItem({ ...editingItem, tagline: e.target.value })}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingItem.description}
                  onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 resize-none"
                />
              </div>

              {/* Save & Cancel */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
