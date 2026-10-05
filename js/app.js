/**
 * Smart Queue Management for College Canteens - Main App Orchestrator & Router
 * Manages view routing, top navigation bar, audio synthesis, multi-tab real-time sync, and toasts.
 */

const App = {
  currentView: 'landing', // Default initial view
  activeRole: 'student',  // 'student' | 'staff'
  audioCtx: null,

  init() {
    // Check saved view or URL hash
    const savedRole = localStorage.getItem(CanteenStore.KEYS.CURRENT_ROLE) || 'student';
    this.activeRole = savedRole;

    const hash = window.location.hash.replace('#', '');
    if (hash) {
      this.currentView = hash;
    } else {
      this.currentView = 'landing';
    }

    // Set up Real-time Multi-Tab Synchronizer
    this.setupRealtimeSync();

    // Initial Render
    this.render();

    // Handle hash change
    window.addEventListener('hashchange', () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash && newHash !== this.currentView) {
        this.currentView = newHash;
        this.render();
      }
    });
  },

  // Navigate to any view with optional route parameters
  navigate(viewName, params = {}) {
    this.currentView = viewName;
    if (params.orderId) {
      this.lastOrderId = params.orderId;
    }

    // Update role context based on view
    if (viewName.startsWith('staff-')) {
      this.activeRole = 'staff';
    } else if (viewName.startsWith('student-') || viewName === 'cart' || viewName === 'my-orders' || viewName === 'order-confirmation') {
      this.activeRole = 'student';
    }
    localStorage.setItem(CanteenStore.KEYS.CURRENT_ROLE, this.activeRole);

    window.location.hash = viewName;
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  switchRole(newRole) {
    this.activeRole = newRole;
    localStorage.setItem(CanteenStore.KEYS.CURRENT_ROLE, newRole);

    if (newRole === 'staff') {
      this.navigate('staff-dashboard');
      this.showToast('Switched to Canteen Staff Portal', 'info');
    } else {
      this.navigate('student-menu');
      this.showToast('Switched to Student Portal', 'info');
    }
  },

  // Multi-Tab & Real-Time Sync Listeners
  setupRealtimeSync() {
    // 1. Storage Event Listener (fires on changes from other tabs)
    window.addEventListener('storage', (e) => {
      if (e.key === CanteenStore.KEYS.LAST_EVENT && e.newValue) {
        try {
          const event = JSON.parse(e.newValue);
          this.handleIncomingEvent(event);
        } catch (err) {
          console.error(err);
        }
      }
    });

    // 2. BroadcastChannel Listener (modern real-time bus)
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel('campus_canteen_channel');
      bc.onmessage = (msg) => {
        if (msg.data) {
          this.handleIncomingEvent(msg.data);
        }
      };
    }
  },

  // Handle events received across browser windows/tabs
  handleIncomingEvent(event) {
    const student = CanteenStore.getCurrentStudent();

    if (event.type === 'order_ready_pickup') {
      // An order was marked ready!
      const order = CanteenStore.getOrderById(event.data.orderId);
      if (this.activeRole === 'student') {
        // If order belongs to this student, trigger huge alert & sound!
        if (order && (order.studentId === student.id || order.studentRoll === student.rollNo)) {
          this.playAudioChime();
          this.showToast(`🎉 YOUR ORDER (Token #${order.tokenNumber}) IS READY FOR PICKUP at ${order.counter || 'Counter 1'}!`, 'success', 8000);
          this.render();
        }
      }
    } else if (event.type === 'new_order_placed') {
      // New order placed!
      if (this.activeRole === 'staff') {
        this.playAudioChime();
        this.showToast(`🔔 New Order Received! Token #${event.data.token}`, 'info', 6000);
        this.render();
      }
    } else if (event.type === 'orders_updated' || event.type === 'menu_updated' || event.type === 'full_reset') {
      // Re-render currently open view
      this.render();
    }
  },

  // Synthesize clean audio chime using Web Audio API (Zero external MP3 dependencies)
  playAudioChime() {
    const settings = CanteenStore.getSettings();
    if (settings.soundEnabled === false) return;

    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      if (this.audioCtx) {
        const now = this.audioCtx.currentTime;
        // Two-tone chime: High bell (880Hz) followed by harmonious third (1108Hz)
        const osc1 = this.audioCtx.createOscillator();
        const gain1 = this.audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, now); // D5
        osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
        gain1.gain.setValueAtTime(0.25, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc1.connect(gain1);
        gain1.connect(this.audioCtx.destination);
        osc1.start(now);
        osc1.stop(now + 0.5);

        const osc2 = this.audioCtx.createOscillator();
        const gain2 = this.audioCtx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(880, now + 0.15);
        osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.3); // D6
        gain2.gain.setValueAtTime(0.2, now + 0.15);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        osc2.connect(gain2);
        gain2.connect(this.audioCtx.destination);
        osc2.start(now + 0.15);
        osc2.stop(now + 0.7);
      }
    } catch (e) {
      console.warn('Audio not allowed yet without user interaction:', e);
    }
  },

  // Toast notification system
  showToast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-slide-in p-4 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-bold max-w-sm w-full ${
      type === 'success' ? 'bg-emerald-600 text-white border-emerald-500' :
      type === 'error' ? 'bg-rose-600 text-white border-rose-500' :
      'bg-slate-900 text-white border-slate-800'
    }`;

    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle-2';
    if (type === 'error') iconName = 'alert-circle';

    toast.innerHTML = `
      <i data-lucide="${iconName}" class="w-5 h-5 flex-shrink-0"></i>
      <span class="flex-1 leading-snug">${message}</span>
      <button onclick="this.parentElement.remove()" class="text-white/60 hover:text-white">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
    `;

    container.appendChild(toast);
    lucide.createIcons({ root: toast });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  // Main Render Routine
  render() {
    const appEl = document.getElementById('app');
    if (!appEl) return;

    // Check if any student order is ready to display top floating notification banner
    const topReadyBanner = this.renderTopReadyBanner();

    let viewHtml = '';
    switch (this.currentView) {
      case 'landing':
        viewHtml = StudentModule.renderLanding();
        break;
      case 'student-login':
        viewHtml = StudentModule.renderAuth('login');
        break;
      case 'student-signup':
        viewHtml = StudentModule.renderAuth('signup');
        break;
      case 'student-menu':
        viewHtml = StudentModule.renderMenu();
        break;
      case 'cart':
        viewHtml = StudentModule.renderCart();
        break;
      case 'order-confirmation':
        viewHtml = StudentModule.renderConfirmation(this.lastOrderId);
        break;
      case 'my-orders':
        viewHtml = StudentModule.renderMyOrders();
        break;
      case 'student-profile':
        viewHtml = StudentModule.renderProfile();
        break;
      case 'staff-login':
        viewHtml = StaffModule.renderAuth();
        break;
      case 'staff-dashboard':
        viewHtml = StaffModule.renderDashboard();
        break;
      case 'staff-orders':
        viewHtml = StaffModule.renderOrders();
        break;
      case 'staff-menu':
        viewHtml = StaffModule.renderMenuManagement();
        break;
      default:
        viewHtml = StudentModule.renderLanding();
    }

    appEl.innerHTML = `
      <div class="min-h-screen flex flex-col bg-[#fdfbf7]">
        <!-- Global Top Ready for Pickup Floating Bar if ready -->
        ${topReadyBanner}

        <!-- Top Navigation Bar -->
        ${this.renderNavbar()}

        <!-- Main Content View -->
        <main class="flex-1 pb-16">
          ${viewHtml}
        </main>

        <!-- Footer -->
        ${this.renderFooter()}

        <!-- Mobile Bottom Nav Bar -->
        ${this.renderMobileNav()}
      </div>
    `;

    // Re-bind Lucide icons
    lucide.createIcons();
  },

  // Persistent ready banner if student has an order waiting at counter
  renderTopReadyBanner() {
    if (this.activeRole !== 'student') return '';
    const student = CanteenStore.getCurrentStudent();
    const orders = CanteenStore.getOrders();
    const readyOrder = orders.find(o => (o.studentId === student.id || o.studentRoll === student.rollNo) && o.status === 'ready');

    if (!readyOrder) return '';

    return `
      <div class="bg-emerald-600 text-white px-4 py-2 text-xs font-bold shadow-md flex items-center justify-between border-b border-emerald-500 z-50">
        <div class="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-white animate-ping"></span>
            <span>🔔 Token #${readyOrder.tokenNumber} is READY FOR PICKUP at ${readyOrder.counter || 'Counter 1'}!</span>
          </div>
          <button onclick="App.navigate('my-orders')" class="underline hover:text-emerald-100 whitespace-nowrap">
            View Token &rarr;
          </button>
        </div>
      </div>
    `;
  },

  // Modern Responsive Navbar
  renderNavbar() {
    const student = CanteenStore.getCurrentStudent();
    const staff = CanteenStore.getCurrentStaff();
    const cart = CanteenStore.getCart();
    const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
    const queueStats = CanteenStore.calculateQueueStats();

    return `
      <header class="sticky top-0 z-40 glass-header">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16 sm:h-18">
            
            <!-- Logo & Title -->
            <div class="flex items-center gap-3 cursor-pointer" onclick="App.navigate('landing')">
              <div class="w-10 h-10 rounded-2xl bg-orange-gradient flex items-center justify-center text-white shadow-md shadow-orange-500/30">
                <i data-lucide="coffee" class="w-5 h-5"></i>
              </div>
              <div>
                <span class="text-lg font-black text-slate-900 tracking-tight leading-none block">
                  Campus<span class="text-orange-600">Bite</span>
                </span>
                <span class="text-[10px] text-slate-500 font-semibold tracking-wide uppercase">Smart Queue Canteen</span>
              </div>
            </div>

            <!-- Role Switcher & Live Queue Pill (Center / Right) -->
            <div class="hidden md:flex items-center gap-2 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/80 text-xs font-bold">
              <button 
                onclick="App.switchRole('student')" 
                class="px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 ${this.activeRole === 'student' ? 'bg-white text-orange-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}"
              >
                <i data-lucide="graduation-cap" class="w-3.5 h-3.5"></i>
                Student View
              </button>
              <button 
                onclick="App.switchRole('staff')" 
                class="px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 ${this.activeRole === 'staff' ? 'bg-white text-orange-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}"
              >
                <i data-lucide="chef-hat" class="w-3.5 h-3.5"></i>
                Staff Kitchen
                ${queueStats.activeCount > 0 ? `<span class="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>` : ''}
              </button>
            </div>

            <!-- Navigation Links based on active role -->
            <nav class="hidden md:flex items-center gap-1">
              ${this.activeRole === 'student' ? `
                <button onclick="App.navigate('student-menu')" class="px-3 py-2 rounded-xl text-xs font-bold ${this.currentView === 'student-menu' ? 'text-orange-600 bg-orange-50' : 'text-slate-600 hover:text-slate-900'}">
                  Menu
                </button>
                <button onclick="App.navigate('my-orders')" class="px-3 py-2 rounded-xl text-xs font-bold relative ${this.currentView === 'my-orders' ? 'text-orange-600 bg-orange-50' : 'text-slate-600 hover:text-slate-900'}">
                  My Orders
                  ${queueStats.readyCount > 0 ? `<span class="absolute top-1.5 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>` : ''}
                </button>
                <button onclick="App.navigate('cart')" class="px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${this.currentView === 'cart' ? 'text-orange-600 bg-orange-50' : 'text-slate-600 hover:text-slate-900'}">
                  <i data-lucide="shopping-bag" class="w-4 h-4"></i>
                  <span>Cart</span>
                  ${cartCount > 0 ? `<span class="px-1.5 py-0.2 rounded-full bg-orange-600 text-white text-[10px]">${cartCount}</span>` : ''}
                </button>
                <button onclick="App.navigate('student-profile')" class="ml-2 flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200">
                  <img src="${student.avatar}" class="w-7 h-7 rounded-full object-cover border border-orange-200" alt="${student.name}"/>
                  <span class="text-xs font-bold text-slate-800">${student.name.split(' ')[0]}</span>
                </button>
              ` : `
                <button onclick="App.navigate('staff-dashboard')" class="px-3 py-2 rounded-xl text-xs font-bold ${this.currentView === 'staff-dashboard' ? 'text-orange-600 bg-orange-50' : 'text-slate-600 hover:text-slate-900'}">
                  Dashboard
                </button>
                <button onclick="App.navigate('staff-orders')" class="px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${this.currentView === 'staff-orders' ? 'text-orange-600 bg-orange-50' : 'text-slate-600 hover:text-slate-900'}">
                  <span>Order Board</span>
                  <span class="px-1.5 py-0.2 rounded-full bg-orange-600 text-white text-[10px]">${queueStats.activeCount}</span>
                </button>
                <button onclick="App.navigate('staff-menu')" class="px-3 py-2 rounded-xl text-xs font-bold ${this.currentView === 'staff-menu' ? 'text-orange-600 bg-orange-50' : 'text-slate-600 hover:text-slate-900'}">
                  Menu & Stock
                </button>
                <button onclick="App.navigate('staff-login')" class="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold">
                  <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
                  Staff Log
                </button>
              `}
            </nav>

            <!-- Mobile Role Switch Icon & Cart Button -->
            <div class="flex items-center gap-2 md:hidden">
              <button 
                onclick="App.switchRole(App.activeRole === 'student' ? 'staff' : 'student')" 
                class="px-2.5 py-1.5 rounded-xl bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200 flex items-center gap-1"
              >
                <i data-lucide="${this.activeRole === 'student' ? 'chef-hat' : 'graduation-cap'}" class="w-3.5 h-3.5"></i>
                <span>${this.activeRole === 'student' ? 'Staff' : 'Student'}</span>
              </button>

              ${this.activeRole === 'student' ? `
                <button onclick="App.navigate('cart')" class="relative p-2 rounded-xl bg-slate-100 text-slate-700">
                  <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                  ${cartCount > 0 ? `<span class="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">${cartCount}</span>` : ''}
                </button>
              ` : ''}
            </div>

          </div>
        </div>
      </header>
    `;
  },

  // Mobile Bottom Navigation Bar
  renderMobileNav() {
    const queueStats = CanteenStore.calculateQueueStats();
    const cart = CanteenStore.getCart();
    const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

    return `
      <div class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-around shadow-lg">
        ${this.activeRole === 'student' ? `
          <button onclick="App.navigate('student-menu')" class="flex flex-col items-center gap-0.5 text-[10px] font-bold ${this.currentView === 'student-menu' ? 'text-orange-600' : 'text-slate-400'}">
            <i data-lucide="utensils" class="w-5 h-5"></i>
            <span>Menu</span>
          </button>
          <button onclick="App.navigate('cart')" class="flex flex-col items-center gap-0.5 text-[10px] font-bold relative ${this.currentView === 'cart' ? 'text-orange-600' : 'text-slate-400'}">
            <i data-lucide="shopping-bag" class="w-5 h-5"></i>
            <span>Cart</span>
            ${cartCount > 0 ? `<span class="absolute -top-1 right-1 bg-orange-600 text-white w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold">${cartCount}</span>` : ''}
          </button>
          <button onclick="App.navigate('my-orders')" class="flex flex-col items-center gap-0.5 text-[10px] font-bold relative ${this.currentView === 'my-orders' ? 'text-orange-600' : 'text-slate-400'}">
            <i data-lucide="clock" class="w-5 h-5"></i>
            <span>Orders</span>
            ${queueStats.readyCount > 0 ? `<span class="absolute -top-1 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>` : ''}
          </button>
          <button onclick="App.navigate('student-profile')" class="flex flex-col items-center gap-0.5 text-[10px] font-bold ${this.currentView === 'student-profile' ? 'text-orange-600' : 'text-slate-400'}">
            <i data-lucide="user" class="w-5 h-5"></i>
            <span>Profile</span>
          </button>
        ` : `
          <button onclick="App.navigate('staff-dashboard')" class="flex flex-col items-center gap-0.5 text-[10px] font-bold ${this.currentView === 'staff-dashboard' ? 'text-orange-600' : 'text-slate-400'}">
            <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
            <span>Dashboard</span>
          </button>
          <button onclick="App.navigate('staff-orders')" class="flex flex-col items-center gap-0.5 text-[10px] font-bold relative ${this.currentView === 'staff-orders' ? 'text-orange-600' : 'text-slate-400'}">
            <i data-lucide="clipboard-list" class="w-5 h-5"></i>
            <span>Orders</span>
            <span class="absolute -top-1 right-2 bg-orange-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">${queueStats.activeCount}</span>
          </button>
          <button onclick="App.navigate('staff-menu')" class="flex flex-col items-center gap-0.5 text-[10px] font-bold ${this.currentView === 'staff-menu' ? 'text-orange-600' : 'text-slate-400'}">
            <i data-lucide="utensils-crossed" class="w-5 h-5"></i>
            <span>Menu</span>
          </button>
        `}
      </div>
    `;
  },

  // Footer Component
  renderFooter() {
    return `
      <footer class="bg-white border-t border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-lg bg-orange-600 flex items-center justify-center text-white">
              <i data-lucide="coffee" class="w-3.5 h-3.5"></i>
            </div>
            <span class="font-extrabold text-slate-800">CampusBite</span>
            <span>• Smart Queue Management for College Canteens</span>
          </div>

          <div class="flex items-center gap-4 text-xs font-semibold">
            <button onclick="App.switchRole('student')" class="hover:text-orange-600">Student Portal</button>
            <span>•</span>
            <button onclick="App.switchRole('staff')" class="hover:text-orange-600">Staff Kitchen Dashboard</button>
            <span>•</span>
            <button onclick="CanteenStore.resetDefaults(); App.showToast('Data reset!', 'info'); App.render();" class="hover:text-red-600">Reset Demo Data</button>
          </div>
        </div>
      </footer>
    `;
  }
};

// Auto start when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
