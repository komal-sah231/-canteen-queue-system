/**
 * Smart Queue Management for College Canteens - Seed Data & Store
 * Provides realistic college canteen menu, students, staff, and initial orders.
 */

const SEED_DATA = {
  categories: [
    { id: 'all', name: 'All Items', icon: 'utensils' },
    { id: 'snacks', name: 'Snacks & Quick Bites', icon: 'cookie' },
    { id: 'meals', name: 'Meals & Combos', icon: 'bowl-food' },
    { id: 'beverages', name: 'Beverages & Shakes', icon: 'coffee' },
    { id: 'desserts', name: 'Desserts & Sweets', icon: 'ice-cream' }
  ],

  menuItems: [
    {
      id: 'item-1',
      name: 'College Special Samosa Duo',
      category: 'snacks',
      price: 35,
      prepTime: 4, // minutes
      isVeg: true,
      inStock: true,
      bestseller: true,
      description: 'Two crispy golden samosas stuffed with spiced potatoes and peas, served with sweet tamarind & mint chutney.',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      calories: 280
    },
    {
      id: 'item-2',
      name: 'Crispy Masala Dosa',
      category: 'meals',
      price: 75,
      prepTime: 8,
      isVeg: true,
      inStock: true,
      bestseller: true,
      description: 'Thin golden crepe filled with spiced mashed potato bhaji, paired with hot sambar and fresh coconut chutney.',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
      calories: 320
    },
    {
      id: 'item-3',
      name: 'Paneer Kathi Roll',
      category: 'snacks',
      price: 90,
      prepTime: 7,
      isVeg: true,
      inStock: true,
      bestseller: false,
      description: 'Char-grilled cottage cheese cubes tossed in spicy onion-capsicum relish, rolled in flaky paratha.',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
      calories: 390
    },
    {
      id: 'item-4',
      name: 'Loaded Veg Cheese Burger',
      category: 'snacks',
      price: 70,
      prepTime: 6,
      isVeg: true,
      inStock: true,
      bestseller: true,
      description: 'Crispy herb potato patty topped with melted cheddar, fresh lettuce, tomato, and chipotle mayo in a sesame bun.',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      calories: 420
    },
    {
      id: 'item-5',
      name: 'Hyderabadi Chicken Biryani Box',
      category: 'meals',
      price: 140,
      prepTime: 10,
      isVeg: false,
      inStock: true,
      bestseller: true,
      description: 'Fragrant basmati rice slow-cooked with tender spiced chicken pieces, served with cool cucumber raita and salan.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      calories: 580
    },
    {
      id: 'item-6',
      name: 'Chole Bhature Campus Platter',
      category: 'meals',
      price: 95,
      prepTime: 9,
      isVeg: true,
      inStock: true,
      bestseller: false,
      description: 'Two fluffy, puffed bhature served with rich Delhi-style tangy chickpea curry, pickled onions, and green chili.',
      image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80',
      calories: 520
    },
    {
      id: 'item-7',
      name: 'Veg Fried Rice with Manchurian',
      category: 'meals',
      price: 110,
      prepTime: 9,
      isVeg: true,
      inStock: false, // out of stock demo
      bestseller: false,
      description: 'Wok-tossed basmati rice with crunchy garden veggies, accompanied by spicy vegetable Manchurian gravy balls.',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
      calories: 460
    },
    {
      id: 'item-8',
      name: 'Thick Cold Coffee with Ice Cream',
      category: 'beverages',
      price: 60,
      prepTime: 3,
      isVeg: true,
      inStock: true,
      bestseller: true,
      description: 'Rich blended espresso shake made with creamy whole milk, topped with a scoop of vanilla ice cream and chocolate drizzle.',
      image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
      calories: 240
    },
    {
      id: 'item-9',
      name: 'Adrak Elaichi Masala Chai (Cutting)',
      category: 'beverages',
      price: 20,
      prepTime: 2,
      isVeg: true,
      inStock: true,
      bestseller: true,
      description: 'Steaming hot college canteen brew infused with fresh pounded ginger and green cardamom pods.',
      image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=600&q=80',
      calories: 90
    },
    {
      id: 'item-10',
      name: 'Fresh Mint Lime Soda',
      category: 'beverages',
      price: 35,
      prepTime: 2,
      isVeg: true,
      inStock: true,
      bestseller: false,
      description: 'Zesty sparkling soda with fresh squeezed limes, bruised mint leaves, rock salt, and sweet syrup.',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
      calories: 110
    },
    {
      id: 'item-11',
      name: 'Warm Fudge Brownie with Vanilla Scoop',
      category: 'desserts',
      price: 70,
      prepTime: 3,
      isVeg: true,
      inStock: true,
      bestseller: true,
      description: 'Dense dark chocolate brownie warmed to perfection, paired with chilled vanilla ice cream and hot chocolate sauce.',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
      calories: 340
    },
    {
      id: 'item-12',
      name: 'Hot Gulab Jamun (2 pcs)',
      category: 'desserts',
      price: 40,
      prepTime: 2,
      isVeg: true,
      inStock: true,
      bestseller: false,
      description: 'Soft melt-in-mouth milk dumplings soaked in rose and saffron infused warm sugar syrup.',
      image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14d48?auto=format&fit=crop&w=600&q=80',
      calories: 260
    }
  ],

  demoStudents: [
    {
      id: 'stud-1',
      name: 'Aarav Sharma',
      email: 'aarav.cs23@campus.edu',
      phone: '+91 98765 43210',
      rollNo: '23-CS-104',
      department: 'Computer Science & Engg',
      year: '3rd Year',
      walletBalance: 420,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 'stud-2',
      name: 'Priya Patel',
      email: 'priya.ec22@campus.edu',
      phone: '+91 98223 88102',
      rollNo: '22-EC-088',
      department: 'Electronics & Comm.',
      year: '4th Year',
      walletBalance: 650,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
    }
  ],

  demoStaff: [
    {
      id: 'staff-1',
      name: 'Chef Ramesh Kumar',
      role: 'Head Chef & Kitchen Lead',
      email: 'chef.ramesh@campus.edu',
      code: 'CHEF123',
      counter: 'Kitchen Station A',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 'staff-2',
      name: 'Meera Deshmukh',
      role: 'Counter Manager',
      email: 'meera.counter@campus.edu',
      code: 'STAFF123',
      counter: 'Pickup Counter 1 & 2',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
    }
  ],

  // Sample existing orders to make the application immediately vibrant and active
  sampleOrders: [
    {
      id: 'CB-1045',
      tokenNumber: '45',
      studentId: 'stud-1',
      studentName: 'Aarav Sharma',
      studentRoll: '23-CS-104',
      studentPhone: '+91 98765 43210',
      items: [
        { id: 'item-1', name: 'College Special Samosa Duo', price: 35, quantity: 1, prepTime: 4 },
        { id: 'item-8', name: 'Thick Cold Coffee with Ice Cream', price: 60, quantity: 1, prepTime: 3 }
      ],
      itemTotal: 95,
      discount: 0,
      totalAmount: 95,
      instructions: 'Extra chocolate syrup in coffee please!',
      pickupType: 'Takeaway',
      status: 'ready', // 'placed' | 'preparing' | 'ready' | 'collected'
      orderTime: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
      estimatedPickupTime: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      readyTime: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      collectedTime: null,
      counter: 'Counter 2'
    },
    {
      id: 'CB-1044',
      tokenNumber: '44',
      studentId: 'stud-2',
      studentName: 'Priya Patel',
      studentRoll: '22-EC-088',
      studentPhone: '+91 98223 88102',
      items: [
        { id: 'item-2', name: 'Crispy Masala Dosa', price: 75, quantity: 1, prepTime: 8 },
        { id: 'item-9', name: 'Adrak Elaichi Masala Chai (Cutting)', price: 20, quantity: 2, prepTime: 2 }
      ],
      itemTotal: 115,
      discount: 10,
      totalAmount: 105,
      instructions: 'Less oil on dosa please',
      pickupType: 'Dine-in',
      status: 'preparing',
      orderTime: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      estimatedPickupTime: new Date(Date.now() + 4 * 60 * 1000).toISOString(),
      readyTime: null,
      collectedTime: null,
      counter: 'Counter 1'
    },
    {
      id: 'CB-1043',
      tokenNumber: '43',
      studentId: 'stud-3',
      studentName: 'Kunal Verma',
      studentRoll: '24-ME-019',
      studentPhone: '+91 97112 33445',
      items: [
        { id: 'item-5', name: 'Hyderabadi Chicken Biryani Box', price: 140, quantity: 1, prepTime: 10 }
      ],
      itemTotal: 140,
      discount: 0,
      totalAmount: 140,
      instructions: 'Extra raita',
      pickupType: 'Takeaway',
      status: 'placed',
      orderTime: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      estimatedPickupTime: new Date(Date.now() + 11 * 60 * 1000).toISOString(),
      readyTime: null,
      collectedTime: null,
      counter: 'Counter 1'
    },
    {
      id: 'CB-1041',
      tokenNumber: '41',
      studentId: 'stud-1',
      studentName: 'Aarav Sharma',
      studentRoll: '23-CS-104',
      studentPhone: '+91 98765 43210',
      items: [
        { id: 'item-4', name: 'Loaded Veg Cheese Burger', price: 70, quantity: 2, prepTime: 6 },
        { id: 'item-10', name: 'Fresh Mint Lime Soda', price: 35, quantity: 1, prepTime: 2 }
      ],
      itemTotal: 175,
      discount: 15,
      totalAmount: 160,
      instructions: 'Crispy patty',
      pickupType: 'Takeaway',
      status: 'collected',
      orderTime: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
      estimatedPickupTime: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
      readyTime: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
      collectedTime: new Date(Date.now() - 44 * 60 * 1000).toISOString(),
      counter: 'Counter 1'
    },
    {
      id: 'CB-1040',
      tokenNumber: '40',
      studentId: 'stud-2',
      studentName: 'Priya Patel',
      studentRoll: '22-EC-088',
      studentPhone: '+91 98223 88102',
      items: [
        { id: 'item-6', name: 'Chole Bhature Campus Platter', price: 95, quantity: 1, prepTime: 9 },
        { id: 'item-11', name: 'Warm Fudge Brownie with Vanilla Scoop', price: 70, quantity: 1, prepTime: 3 }
      ],
      itemTotal: 165,
      discount: 0,
      totalAmount: 165,
      instructions: '',
      pickupType: 'Dine-in',
      status: 'collected',
      orderTime: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
      estimatedPickupTime: new Date(Date.now() - 105 * 60 * 1000).toISOString(),
      readyTime: new Date(Date.now() - 104 * 60 * 1000).toISOString(),
      collectedTime: new Date(Date.now() - 98 * 60 * 1000).toISOString(),
      counter: 'Counter 2'
    }
  ]
};

// Global Store Helper for LocalStorage + Real-time Sync
const CanteenStore = {
  KEYS: {
    MENU: 'canteen_menu_items',
    ORDERS: 'canteen_orders',
    STUDENTS: 'canteen_students',
    CURRENT_USER: 'canteen_current_user',
    CURRENT_ROLE: 'canteen_active_role', // 'student' | 'staff'
    ACTIVE_STUDENT_ID: 'canteen_active_student_id',
    ACTIVE_STAFF_ID: 'canteen_active_staff_id',
    CART: 'canteen_cart_items',
    SETTINGS: 'canteen_settings',
    LAST_EVENT: 'canteen_last_event'
  },

  // Initialize store with seed data if not present
  init() {
    if (!localStorage.getItem(this.KEYS.MENU)) {
      localStorage.setItem(this.KEYS.MENU, JSON.stringify(SEED_DATA.menuItems));
    }
    if (!localStorage.getItem(this.KEYS.ORDERS)) {
      localStorage.setItem(this.KEYS.ORDERS, JSON.stringify(SEED_DATA.sampleOrders));
    }
    if (!localStorage.getItem(this.KEYS.STUDENTS)) {
      localStorage.setItem(this.KEYS.STUDENTS, JSON.stringify(SEED_DATA.demoStudents));
    }
    if (!localStorage.getItem(this.KEYS.CART)) {
      localStorage.setItem(this.KEYS.CART, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.KEYS.CURRENT_ROLE)) {
      localStorage.setItem(this.KEYS.CURRENT_ROLE, 'student');
    }
    if (!localStorage.getItem(this.KEYS.ACTIVE_STUDENT_ID)) {
      localStorage.setItem(this.KEYS.ACTIVE_STUDENT_ID, 'stud-1');
    }
    if (!localStorage.getItem(this.KEYS.ACTIVE_STAFF_ID)) {
      localStorage.setItem(this.KEYS.ACTIVE_STAFF_ID, 'staff-1');
    }
    if (!localStorage.getItem(this.KEYS.SETTINGS)) {
      localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify({
        canteenName: 'CampusBite Canteen',
        canteenStatus: 'open', // 'open' | 'busy' | 'closed'
        baseQueueMultiplier: 2.5, // 2.5 mins added per active prep order
        soundEnabled: true,
        rushHour: false
      }));
    }
  },

  getMenu() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.MENU)) || SEED_DATA.menuItems;
    } catch (e) {
      return SEED_DATA.menuItems;
    }
  },

  saveMenu(items) {
    localStorage.setItem(this.KEYS.MENU, JSON.stringify(items));
    this.broadcastChange('menu_updated', { count: items.length });
  },

  getOrders() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.ORDERS)) || SEED_DATA.sampleOrders;
    } catch (e) {
      return SEED_DATA.sampleOrders;
    }
  },

  saveOrders(orders) {
    localStorage.setItem(this.KEYS.ORDERS, JSON.stringify(orders));
    this.broadcastChange('orders_updated', { count: orders.length });
  },

  getOrderById(id) {
    return this.getOrders().find(o => o.id === id);
  },

  getStudents() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.STUDENTS)) || SEED_DATA.demoStudents;
    } catch (e) {
      return SEED_DATA.demoStudents;
    }
  },

  saveStudents(students) {
    localStorage.setItem(this.KEYS.STUDENTS, JSON.stringify(students));
  },

  getCurrentStudent() {
    const id = localStorage.getItem(this.KEYS.ACTIVE_STUDENT_ID) || 'stud-1';
    const students = this.getStudents();
    return students.find(s => s.id === id) || students[0];
  },

  setCurrentStudent(studentId) {
    localStorage.setItem(this.KEYS.ACTIVE_STUDENT_ID, studentId);
    this.broadcastChange('student_switched', { studentId });
  },

  getCurrentStaff() {
    const id = localStorage.getItem(this.KEYS.ACTIVE_STAFF_ID) || 'staff-1';
    return SEED_DATA.demoStaff.find(s => s.id === id) || SEED_DATA.demoStaff[0];
  },

  getCart() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.CART)) || [];
    } catch (e) {
      return [];
    }
  },

  saveCart(cart) {
    localStorage.setItem(this.KEYS.CART, JSON.stringify(cart));
    this.broadcastChange('cart_updated', { items: cart });
  },

  clearCart() {
    this.saveCart([]);
  },

  addToCart(itemId, quantity = 1) {
    const menu = this.getMenu();
    const item = menu.find(i => i.id === itemId);
    if (!item || !item.inStock) return false;

    let cart = this.getCart();
    const existing = cart.find(c => c.itemId === itemId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        itemId: item.id,
        name: item.name,
        price: item.price,
        prepTime: item.prepTime,
        image: item.image,
        isVeg: item.isVeg,
        quantity: quantity
      });
    }
    this.saveCart(cart);
    return true;
  },

  updateCartQuantity(itemId, quantity) {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter(c => c.itemId !== itemId);
    } else {
      const target = cart.find(c => c.itemId === itemId);
      if (target) {
        target.quantity = quantity;
      }
    }
    this.saveCart(cart);
  },

  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.SETTINGS)) || {};
    } catch (e) {
      return {};
    }
  },

  saveSettings(settings) {
    localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
    this.broadcastChange('settings_updated', settings);
  },

  // Calculate dynamic queue wait time
  calculateQueueStats() {
    const orders = this.getOrders();
    const activeOrders = orders.filter(o => o.status === 'placed' || o.status === 'preparing');
    const settings = this.getSettings();
    const multiplier = settings.rushHour ? 3.5 : (settings.baseQueueMultiplier || 2.5);

    // Baseline queue delay: active orders * multiplier
    const queueDelayMins = Math.round(activeOrders.length * multiplier);
    const avgWaitTime = Math.max(5, queueDelayMins);

    return {
      activeCount: activeOrders.length,
      placedCount: orders.filter(o => o.status === 'placed').length,
      preparingCount: orders.filter(o => o.status === 'preparing').length,
      readyCount: orders.filter(o => o.status === 'ready').length,
      completedCount: orders.filter(o => o.status === 'collected').length,
      estimatedWaitMins: avgWaitTime,
      totalOrdersToday: orders.length,
      revenueToday: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
    };
  },

  // Dynamic estimated pickup time for a specific cart or order
  calculateEstimatedPickup(itemPrepTimes = [5]) {
    const queueStats = this.calculateQueueStats();
    const maxItemPrep = Math.max(...itemPrepTimes, 3);
    const totalMinutes = queueStats.estimatedWaitMins + maxItemPrep;
    const readyDate = new Date(Date.now() + totalMinutes * 60 * 1000);

    return {
      totalMinutes,
      readyDate,
      formattedTime: readyDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  },

  // Broadcast events across browser tabs/windows
  broadcastChange(type, data) {
    const payload = {
      type,
      data,
      timestamp: Date.now()
    };
    try {
      localStorage.setItem(this.KEYS.LAST_EVENT, JSON.stringify(payload));
      if ('BroadcastChannel' in window) {
        if (!this.bc) {
          this.bc = new BroadcastChannel('campus_canteen_channel');
        }
        this.bc.postMessage(payload);
      }
    } catch (e) {
      console.warn('Broadcast error:', e);
    }
  },

  // Reset demo data
  resetDefaults() {
    localStorage.removeItem(this.KEYS.MENU);
    localStorage.removeItem(this.KEYS.ORDERS);
    localStorage.removeItem(this.KEYS.STUDENTS);
    localStorage.removeItem(this.KEYS.CART);
    localStorage.removeItem(this.KEYS.SETTINGS);
    this.init();
    this.broadcastChange('full_reset', {});
  }
};

// Initialize right away
CanteenStore.init();
