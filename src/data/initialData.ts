import { MenuItem, CustomerReview, Order } from '../types/bakery';

// Generated image assets
export const BAKERY_HERO_IMAGE = '/src/assets/images/bakery_hero_artisanal_1790586226399.jpg';
export const SOURDOUGH_IMAGE = '/src/assets/images/bakery_sourdough_boule_1790586242336.jpg';
export const CROISSANT_IMAGE = '/src/assets/images/bakery_butter_croissant_1790586255144.jpg';
export const CARDAMOM_BUN_IMAGE = '/src/assets/images/bakery_cardamom_pistachio_1790586268058.jpg';
export const MANGO_CAKE_IMAGE = '/src/assets/images/bakery_mango_tres_leches_1790586299578.jpg';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'bake-01',
    name: 'San Francisco Country Sourdough Boule',
    tagline: '36-hour slow cold fermentation with wild starter',
    description: 'Crisp blistered mahogany crust, custard-like open crumb, and a deeply satisfying subtle lactic tang. Baked on stone decks every dawn.',
    category: 'Sourdough & Breads',
    price: 260,
    image: SOURDOUGH_IMAGE,
    stock: 9,
    initialStock: 16,
    dietary: 'Vegan',
    freshBatchTime: 'Out of oven at 6:45 AM',
    rating: 4.9,
    reviewCount: 58,
    isSpecialToday: true,
    ingredients: ['Stoneground organic whole wheat flour', 'Filtered spring water', 'Natural sourdough culture', 'Sea salt from Tuticorin'],
    allergens: ['Wheat (Gluten)'],
    weightOrServing: '650g artisan loaf'
  },
  {
    id: 'bake-02',
    name: 'French Butter Croissant',
    tagline: '81 delicate flaky honeycomb layers of Normandy butter',
    description: 'Crispy paper-thin exterior that shatters gently upon biting, unveiling an airy, aromatic honeycomb matrix scented with pure churned butter.',
    category: 'Viennoiserie & Pastries',
    price: 180,
    image: CROISSANT_IMAGE,
    stock: 6,
    initialStock: 24,
    dietary: 'Eggless',
    freshBatchTime: 'Second batch out at 8:15 AM',
    rating: 4.9,
    reviewCount: 84,
    isSpecialToday: false,
    ingredients: ['Enriched unbleached flour', 'AOP cultured butter 84% fat', 'Fresh whole milk', 'Cane sugar', 'Yeast', 'Sea salt'],
    allergens: ['Wheat (Gluten)', 'Dairy'],
    weightOrServing: '110g pastry'
  },
  {
    id: 'bake-03',
    name: 'Cardamom & Iranian Pistachio Morning Knot',
    tagline: 'Freshly cracked green cardamom & Sicilian pistachio butter',
    description: 'Twisted Scandinavian brioche dough laminated with aromatic freshly ground green cardamom, cinnamon sugar, and crowned with roasted crushed pistachios.',
    category: 'Viennoiserie & Pastries',
    price: 220,
    image: CARDAMOM_BUN_IMAGE,
    stock: 3, // Low stock on purpose to show real-time urgency!
    initialStock: 18,
    dietary: 'Eggless',
    freshBatchTime: 'Morning batch at 7:30 AM',
    rating: 4.8,
    reviewCount: 47,
    isSpecialToday: true,
    ingredients: ['Flour', 'Butter', 'Freshly ground Wayanad green cardamom', 'Iranian pistachios', 'Raw brown sugar', 'Milk'],
    allergens: ['Wheat (Gluten)', 'Dairy', 'Tree nuts (Pistachios)'],
    weightOrServing: '130g knot'
  },
  {
    id: 'bake-04',
    name: 'Alphonso Mango Tres Leches Cake',
    tagline: 'Ratnagiri mango pulp soaked in three spiced milks',
    description: 'Light-as-air vanilla sponge soaked in cardamom-infused evaporated milk, condensed milk, and fresh cream, layered with ripe Alphonso mango compote and velvet mascarpone.',
    category: 'Cakes & Desserts',
    price: 340,
    image: MANGO_CAKE_IMAGE,
    stock: 7,
    initialStock: 12,
    dietary: 'Eggless',
    freshBatchTime: 'Chilled & set this morning at 8:00 AM',
    rating: 5.0,
    reviewCount: 39,
    isSpecialToday: true,
    ingredients: ['Organic sponge flour', 'Fresh Alphonso mango pulp', 'Heavy cream', 'Condensed milk', 'Cardamom', 'Pure vanilla extract'],
    allergens: ['Wheat (Gluten)', 'Dairy'],
    weightOrServing: '220g dessert slice'
  },
  {
    id: 'bake-05',
    name: 'Rosemary & Malabar Sea Salt Focaccia',
    tagline: 'Extra virgin olive oil drenched airy Italian flatbread',
    description: 'Dimpled olive oil bread studded with garden fresh rosemary needles, roasted garlic cloves, cherry tomatoes, and crunchy flakes of sea salt.',
    category: 'Sourdough & Breads',
    price: 240,
    image: SOURDOUGH_IMAGE,
    stock: 4,
    initialStock: 14,
    dietary: 'Vegan',
    freshBatchTime: 'Out of oven at 7:00 AM',
    rating: 4.8,
    reviewCount: 31,
    isSpecialToday: false,
    ingredients: ['Cold pressed extra virgin olive oil', 'Fermented wheat flour', 'Fresh rosemary', 'Confit garlic', 'Sea salt crystals'],
    allergens: ['Wheat (Gluten)'],
    weightOrServing: '400g slab'
  },
  {
    id: 'bake-06',
    name: 'Artisanal Paneer & Smoked Paprika Puff',
    tagline: 'Malai paneer cubes tossed in house ground roasted spices',
    description: 'Melt-in-mouth laminated puff pastry turnover packed with spiced cottage cheese, caramelized shallots, and fragrant curry leaf oil.',
    category: 'Savory Bakes',
    price: 160,
    image: CROISSANT_IMAGE,
    stock: 8,
    initialStock: 20,
    dietary: 'Eggless',
    freshBatchTime: 'Fresh hot batch at 8:30 AM',
    rating: 4.7,
    reviewCount: 42,
    isSpecialToday: false,
    ingredients: ['Handmade puff dough', 'Fresh artisanal paneer', 'Shallots', 'Smoked Kashmiri paprika', 'Cumin seeds', 'Coriander'],
    allergens: ['Wheat (Gluten)', 'Dairy'],
    weightOrServing: '140g savory pastry'
  },
  {
    id: 'bake-07',
    name: 'Heritage Parsi Mawa Cake with Slivers of Almond',
    tagline: 'Irani cafe recipe enriched with slow-reduced milk solids',
    description: 'Dense, aromatic cardamom-spiced butter cake enriched with caramelized mawa (khoya) and generous toasted almond shavings on top.',
    category: 'Cakes & Desserts',
    price: 210,
    image: CARDAMOM_BUN_IMAGE,
    stock: 5,
    initialStock: 15,
    dietary: 'Contains Egg',
    freshBatchTime: 'Baked this morning at 7:45 AM',
    rating: 4.9,
    reviewCount: 63,
    isSpecialToday: false,
    ingredients: ['Fresh mawa (khoya)', 'Farm eggs', 'Ghee & butter', 'Flour', 'Cardamom', 'Nutmeg', 'Sliced Mamra almonds'],
    allergens: ['Dairy', 'Eggs', 'Wheat (Gluten)', 'Tree nuts (Almonds)'],
    weightOrServing: '180g cake loaf'
  },
  {
    id: 'bake-08',
    name: 'Belgian 70% Dark Chocolate Sea Salt Cruffin',
    tagline: 'Croissant-muffin hybrid injected with molten Valrhona ganache',
    description: 'Golden spiral cruffin rolled in organic vanilla sugar, piped with warm dark chocolate ganache, and finished with Maldon sea salt.',
    category: 'Viennoiserie & Pastries',
    price: 230,
    image: CROISSANT_IMAGE,
    stock: 2, // Very low stock!
    initialStock: 16,
    dietary: 'Eggless',
    freshBatchTime: 'Limited morning drop at 8:00 AM',
    rating: 4.9,
    reviewCount: 71,
    isSpecialToday: true,
    ingredients: ['Viennoiserie dough', 'Valrhona 70% dark chocolate', 'Cream', 'Vanilla bean', 'Flaked sea salt'],
    allergens: ['Wheat (Gluten)', 'Dairy'],
    weightOrServing: '135g pastry'
  },
  {
    id: 'bake-09',
    name: 'Slow Steeped Vanilla Bean Cold Brew',
    tagline: '18-hour cold drip using Chikmagalur single estate Arabica',
    description: 'Smooth, naturally sweet cold coffee with notes of dark cocoa and roasted hazelnut, infused with whole Madagascar vanilla bean pods.',
    category: 'Beverages & Brews',
    price: 190,
    image: BAKERY_HERO_IMAGE,
    stock: 15,
    initialStock: 25,
    dietary: 'Vegan',
    freshBatchTime: 'Bottled fresh at 6:00 AM',
    rating: 4.8,
    reviewCount: 29,
    isSpecialToday: false,
    ingredients: ['Single origin Chikmagalur Arabica beans', 'Purified mineral water', 'Real Bourbon vanilla pods'],
    allergens: [],
    weightOrServing: '300ml glass bottle'
  }
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-01',
    itemId: 'bake-01',
    itemName: 'San Francisco Country Sourdough Boule',
    customerName: 'Ananya Deshmukh',
    rating: 5,
    date: '2 hours ago',
    comment: 'Without doubt the best sourdough in South Mumbai! The crust has that unmistakable crackle and the crumb is heavenly. Toasted a slice with salted butter and garlic—pure magic.',
    verifiedPurchase: true,
    tag: 'Sourdough Purist'
  },
  {
    id: 'rev-02',
    itemId: 'bake-02',
    itemName: 'French Butter Croissant',
    customerName: 'Rohan Mehra',
    rating: 5,
    date: 'Yesterday',
    comment: 'The lamination is on par with Parisian boulangeries. Crispy, buttery without feeling oily, and pairs perfectly with morning cappuccino. Ordered via online delivery and it arrived still warm!',
    verifiedPurchase: true,
    tag: 'Breakfast Regular'
  },
  {
    id: 'rev-03',
    itemId: 'bake-04',
    itemName: 'Alphonso Mango Tres Leches Cake',
    customerName: 'Priya Sundaram',
    rating: 5,
    date: '2 days ago',
    comment: 'Ordered this for my sister’s birthday dinner. The balance of sweetness is phenomenal—the fresh Alphonso mango pulp shines and the cardamom-soaked sponge literally dissolves on your tongue.',
    verifiedPurchase: true,
    tag: 'Celebration Order'
  },
  {
    id: 'rev-04',
    itemId: 'bake-03',
    itemName: 'Cardamom & Iranian Pistachio Morning Knot',
    customerName: 'Kabir Varma',
    rating: 5,
    date: '3 days ago',
    comment: 'The scent of green cardamom when you open the brown bakery box is intoxicating. Generous pistachios and soft pillowy dough. Definitely ordering again this weekend!',
    verifiedPurchase: true,
    tag: 'Weekend Treat'
  },
  {
    id: 'rev-05',
    itemId: 'bake-08',
    itemName: 'Belgian 70% Dark Chocolate Sea Salt Cruffin',
    customerName: 'Shalini Nambiar',
    rating: 5,
    date: 'Sep 25, 2026',
    comment: 'Deep dark chocolate ganache with flaky salt cuts the richness so beautifully. You have to order early because these sell out before 10 AM every single morning.',
    verifiedPurchase: true,
    tag: 'Dessert Connoisseur'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'HC-9421',
    customerName: 'Aarav Singhania',
    customerPhone: '+91 98201 44829',
    customerEmail: 'aarav.singh@example.com',
    deliveryType: 'delivery',
    deliveryAddress: 'Flat 402, Sea Green Apts, Worli Sea Face, Mumbai 400018',
    slot: 'Morning Batch (9:00 AM - 11:00 AM)',
    items: [
      { id: 'bake-01', name: 'Country Sourdough Boule', price: 260, quantity: 1, image: SOURDOUGH_IMAGE },
      { id: 'bake-02', name: 'French Butter Croissant', price: 180, quantity: 2, image: CROISSANT_IMAGE }
    ],
    subtotal: 620,
    deliveryFee: 50,
    packagingFee: 20,
    discount: 50,
    couponCode: 'WELCOME50',
    total: 640,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    status: 'baking',
    placedAt: 'Today, 8:20 AM',
    estimatedTime: 'Estimated delivery by 9:45 AM',
    notes: 'Please leave with society security if not answering.',
    timeline: [
      { status: 'placed', label: 'Order Confirmed', time: '8:20 AM', done: true, description: 'Payment of ₹640 received via UPI.' },
      { status: 'baking', label: 'Baking in Hearth Oven', time: '8:35 AM', done: true, description: 'Loaves and croissants loaded onto stone deck ovens.' },
      { status: 'packed', label: 'Artisanal Packing & Quality Check', time: 'Pending', done: false, description: 'Cooling rack resting and wrapped in butter paper.' },
      { status: 'out_for_delivery', label: 'Out with Bakery Rider', time: 'Pending', done: false, description: 'Dispatched in thermal delivery carrier.' },
      { status: 'delivered', label: 'Delivered Fresh', time: 'Pending', done: false, description: 'Handed over warm to customer.' }
    ]
  },
  {
    id: 'HC-9420',
    customerName: 'Meera Iyer',
    customerPhone: '+91 98110 55902',
    customerEmail: 'meera.iyer@example.com',
    deliveryType: 'pickup',
    slot: 'Morning Batch (8:30 AM - 10:30 AM)',
    items: [
      { id: 'bake-04', name: 'Alphonso Mango Tres Leches', price: 340, quantity: 1, image: MANGO_CAKE_IMAGE },
      { id: 'bake-03', name: 'Cardamom & Pistachio Knot', price: 220, quantity: 2, image: CARDAMOM_BUN_IMAGE }
    ],
    subtotal: 780,
    deliveryFee: 0,
    packagingFee: 20,
    discount: 78,
    couponCode: 'CRUST10',
    total: 722,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    status: 'packed',
    placedAt: 'Today, 7:50 AM',
    estimatedTime: 'Ready for Counter Pickup',
    notes: 'Will pick up in bakery before 10 AM.',
    timeline: [
      { status: 'placed', label: 'Order Confirmed', time: '7:50 AM', done: true, description: 'Payment of ₹722 verified.' },
      { status: 'baking', label: 'Pastry Proofing & Baking', time: '8:05 AM', done: true, description: 'Cardamom knots baked to golden perfection.' },
      { status: 'packed', label: 'Ready for Pickup', time: '8:40 AM', done: true, description: 'Packed in bespoke bakery gift box at counter.' },
      { status: 'delivered', label: 'Picked Up by Customer', time: 'Pending', done: false, description: 'Waiting for patron at counter.' }
    ]
  },
  {
    id: 'HC-9418',
    customerName: 'Vikramaditya Roy',
    customerPhone: '+91 97690 12384',
    customerEmail: 'vikram.roy@example.com',
    deliveryType: 'delivery',
    deliveryAddress: '12B, Sterling Towers, Bandra West, Mumbai 400050',
    slot: 'Early Dawn (7:30 AM - 9:00 AM)',
    items: [
      { id: 'bake-01', name: 'Country Sourdough Boule', price: 260, quantity: 2, image: SOURDOUGH_IMAGE },
      { id: 'bake-06', name: 'Paneer & Paprika Puff', price: 160, quantity: 3, image: CROISSANT_IMAGE }
    ],
    subtotal: 1000,
    deliveryFee: 50,
    packagingFee: 25,
    discount: 100,
    couponCode: 'CRUST10',
    total: 975,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    status: 'delivered',
    placedAt: 'Today, 7:10 AM',
    estimatedTime: 'Delivered at 8:15 AM',
    notes: 'Ring doorbell twice.',
    timeline: [
      { status: 'placed', label: 'Order Confirmed', time: '7:10 AM', done: true, description: 'Payment of ₹975 received.' },
      { status: 'baking', label: 'Oven Bake Complete', time: '7:25 AM', done: true, description: 'Fresh loaves pulled from the stone hearth.' },
      { status: 'packed', label: 'Packed & Sealed', time: '7:45 AM', done: true, description: 'Sealed with bakery tamper-proof ribbon.' },
      { status: 'out_for_delivery', label: 'Dispatched with Courier', time: '7:55 AM', done: true, description: 'En route to Bandra West.' },
      { status: 'delivered', label: 'Delivered', time: '8:15 AM', done: true, description: 'Delivered safely into customer hands.' }
    ]
  }
];

export const AVAILABLE_COUPONS: { code: string; label: string; discountType: 'fixed' | 'percent'; value: number; minOrder: number }[] = [
  { code: 'WELCOME50', label: '₹50 Flat Off your first bakery order', discountType: 'fixed', value: 50, minOrder: 300 },
  { code: 'CRUST10', label: '10% Off on artisanal sourdough and pastries', discountType: 'percent', value: 10, minOrder: 500 },
  { code: 'SWEETTREAT', label: '₹100 Off on orders above ₹1,000', discountType: 'fixed', value: 100, minOrder: 1000 }
];
