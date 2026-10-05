/**
 * Smart Queue Management for College Canteens - Student Module
 * Manages Student Landing, Auth, Menu browsing, Cart & Checkout, Order Confirmation, Live My Orders, and Profile.
 */

const StudentModule = {
  activeCategory: 'all',
  searchQuery: '',
  filterVegOnly: false,
  sortBy: 'popular',
  discountApplied: true, // 10% student subsidy applied by default
  discountCode: 'CAMPUS10',

  // Initialize student listeners or state
  init() {
    // Listen for storage events to update cart count or active orders
  },

  // 1. Landing Page View
  renderLanding() {
    const queueStats = CanteenStore.calculateQueueStats();
    const student = CanteenStore.getCurrentStudent();

    return `
      <div class="relative overflow-hidden">
        <!-- Hero Section -->
        <div class="relative bg-warm-gradient pt-8 pb-16 px-4 sm:px-6 lg:px-8 border-b border-orange-100">
          <div class="max-w-7xl mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-800 text-xs font-semibold uppercase tracking-wider">
                  <span class="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
                  Campus Food Court • Live Queue System
                </div>
                
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Skip the long queue. <br/>
                  <span class="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                    Savor every minute.
                  </span>
                </h1>
                
                <p class="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                  Pre-order hot, fresh meals right from your phone between lectures. Get an accurate pickup time, watch live kitchen progress, and collect your food without standing in line.
                </p>

                <!-- Action CTA buttons -->
                <div class="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <button onclick="App.navigate('student-menu')" class="px-7 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-base shadow-lg shadow-orange-600/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                    <i data-lucide="utensils" class="w-5 h-5"></i>
                    Explore Canteen Menu
                  </button>
                  <button onclick="App.navigate('staff-dashboard')" class="px-6 py-3.5 rounded-xl bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-700 font-semibold text-base border border-slate-200 shadow-sm transition-all flex items-center gap-2">
                    <i data-lucide="chef-hat" class="w-5 h-5 text-orange-600"></i>
                    Staff Kitchen Portal
                  </button>
                </div>

                <!-- Fast features list -->
                <div class="grid grid-cols-3 gap-3 pt-4 border-t border-orange-200/60 max-w-lg mx-auto lg:mx-0">
                  <div class="text-left">
                    <p class="text-xs text-slate-500 font-medium">⚡ Pre-Order</p>
                    <p class="text-sm font-bold text-slate-800">Zero Wait Time</p>
                  </div>
                  <div class="text-left">
                    <p class="text-xs text-slate-500 font-medium">⏱️ Smart Time</p>
                    <p class="text-sm font-bold text-slate-800">Dynamic Estimates</p>
                  </div>
                  <div class="text-left">
                    <p class="text-xs text-slate-500 font-medium">🔔 Live Alerts</p>
                    <p class="text-sm font-bold text-slate-800">Counter Pickup</p>
                  </div>
                </div>
              </div>

              <!-- Live Queue Status Hero Card -->
              <div class="lg:col-span-5">
                <div class="bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-orange-500/10 border border-orange-100 relative">
                  <div class="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h3 class="font-bold text-slate-900 text-lg flex items-center gap-2">
                        <i data-lucide="activity" class="w-5 h-5 text-orange-500"></i>
                        Live Canteen Queue
                      </h3>
                      <p class="text-xs text-slate-500">Real-time load from Central Kitchen</p>
                    </div>
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${queueStats.activeCount > 8 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}">
                      <span class="w-2 h-2 rounded-full ${queueStats.activeCount > 8 ? 'bg-amber-500' : 'bg-emerald-500'}"></span>
                      ${queueStats.activeCount > 8 ? 'High Rush' : 'Smooth Flow'}
                    </span>
                  </div>

                  <div class="grid grid-cols-2 gap-4 my-5">
                    <div class="p-4 rounded-2xl bg-orange-50 border border-orange-100 text-center">
                      <p class="text-xs text-orange-600 font-semibold uppercase tracking-wider">Est. Wait Time</p>
                      <p class="text-3xl font-extrabold text-orange-950 mt-1">~${queueStats.estimatedWaitMins} <span class="text-sm font-normal text-orange-700">mins</span></p>
                      <p class="text-[11px] text-orange-700/80 mt-1">Order now for fast pickup</p>
                    </div>
                    <div class="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center">
                      <p class="text-xs text-amber-600 font-semibold uppercase tracking-wider">Orders In Prep</p>
                      <p class="text-3xl font-extrabold text-amber-950 mt-1">${queueStats.activeCount} <span class="text-sm font-normal text-amber-700">active</span></p>
                      <p class="text-[11px] text-amber-700/80 mt-1">Kitchen operating 2 stations</p>
                    </div>
                  </div>

                  <!-- Quick Demo User Card -->
                  <div class="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <img src="${student.avatar}" class="w-10 h-10 rounded-full object-cover border border-white shadow-sm" alt="${student.name}"/>
                      <div>
                        <p class="text-xs text-slate-500">Logged in as Student</p>
                        <p class="text-sm font-bold text-slate-900">${student.name} <span class="text-xs font-normal text-slate-500">(${student.rollNo})</span></p>
                      </div>
                    </div>
                    <button onclick="App.navigate('student-profile')" class="text-xs text-orange-600 hover:text-orange-700 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-orange-50 transition">
                      View Profile
                    </button>
                  </div>

                  <!-- Fast order recommendations button -->
                  <button onclick="App.navigate('student-menu')" class="w-full mt-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition flex items-center justify-center gap-2">
                    <span>Order Now & Get Token</span>
                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- How It Works Section -->
        <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-2xl mx-auto mb-12">
            <h2 class="text-2xl sm:text-3xl font-bold text-slate-900">How Smart Canteen Works</h2>
            <p class="text-slate-600 text-sm sm:text-base mt-2">Four simple steps to get your favorite campus meal without the queue</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition text-center relative group">
              <div class="w-14 h-14 mx-auto rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                <i data-lucide="smartphone" class="w-7 h-7"></i>
              </div>
              <span class="inline-block px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold mb-2">Step 1</span>
              <h3 class="font-bold text-slate-900 text-base">Browse & Pre-Order</h3>
              <p class="text-xs text-slate-500 mt-2">Explore the campus menu, filter veg/bestsellers, and place your order from your classroom.</p>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition text-center relative group">
              <div class="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                <i data-lucide="ticket" class="w-7 h-7"></i>
              </div>
              <span class="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold mb-2">Step 2</span>
              <h3 class="font-bold text-slate-900 text-base">Receive Digital Token</h3>
              <p class="text-xs text-slate-500 mt-2">Get an instant digital token number along with dynamic estimated pickup countdown.</p>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition text-center relative group">
              <div class="w-14 h-14 mx-auto rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                <i data-lucide="flame" class="w-7 h-7"></i>
              </div>
              <span class="inline-block px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold mb-2">Step 3</span>
              <h3 class="font-bold text-slate-900 text-base">Live Kitchen Prep</h3>
              <p class="text-xs text-slate-500 mt-2">Watch status progress: Placed ➔ Preparing in Kitchen ➔ Ready for Pickup.</p>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition text-center relative group">
              <div class="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                <i data-lucide="bell-ring" class="w-7 h-7"></i>
              </div>
              <span class="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">Step 4</span>
              <h3 class="font-bold text-slate-900 text-base">Grab & Go</h3>
              <p class="text-xs text-slate-500 mt-2">Get notified with a chime when food is hot and ready. Show your token at the counter and collect!</p>
            </div>
          </div>
        </div>

        <!-- Popular Menu Highlights Spotlight -->
        <div class="bg-slate-50/70 border-t border-slate-100 py-14 px-4 sm:px-6 lg:px-8">
          <div class="max-w-7xl mx-auto">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 class="text-2xl font-bold text-slate-900">Campus Favorites Today</h2>
                <p class="text-xs sm:text-sm text-slate-500">Most ordered items by college students this week</p>
              </div>
              <button onclick="App.navigate('student-menu')" class="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700">
                View Full Menu (${CanteenStore.getMenu().length} items)
                <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              ${CanteenStore.getMenu().filter(i => i.bestseller).slice(0, 4).map(item => `
                <div class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  <div class="relative h-44 overflow-hidden bg-slate-100">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"/>
                    <div class="absolute top-3 left-3 flex gap-1.5">
                      <span class="${item.isVeg ? 'veg-badge' : 'non-veg-badge'}" title="${item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}"></span>
                      <span class="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold tracking-wide shadow-sm flex items-center gap-1">
                        <i data-lucide="flame" class="w-3 h-3"></i> Top Pick
                      </span>
                    </div>
                    <div class="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-white px-2 py-0.5 rounded-lg text-xs font-semibold flex items-center gap-1">
                      <i data-lucide="clock" class="w-3 h-3 text-orange-400"></i> ${item.prepTime}m prep
                    </div>
                  </div>
                  <div class="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 class="font-bold text-slate-900 text-base">${item.name}</h4>
                      <p class="text-xs text-slate-500 mt-1 line-clamp-2">${item.description}</p>
                    </div>
                    <div class="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
                      <span class="text-lg font-extrabold text-slate-900">₹${item.price}</span>
                      <button onclick="StudentModule.handleQuickAdd('${item.id}')" class="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white font-semibold text-xs transition flex items-center gap-1.5">
                        <i data-lucide="plus" class="w-4 h-4"></i> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

      </div>
    `;
  },

  // 2. Student Login & Sign Up View
  renderAuth(mode = 'login') {
    const students = CanteenStore.getStudents();

    return `
      <div class="max-w-md mx-auto my-8 sm:my-14 px-4">
        <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100">
          
          <div class="text-center mb-6">
            <div class="w-14 h-14 mx-auto rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-2xl mb-3 shadow-inner">
              <i data-lucide="graduation-cap" class="w-7 h-7"></i>
            </div>
            <h2 class="text-2xl font-extrabold text-slate-900">${mode === 'login' ? 'Student Sign In' : 'Create Student Account'}</h2>
            <p class="text-xs sm:text-sm text-slate-500 mt-1">Pre-order meals and collect without queueing</p>
          </div>

          <!-- Quick 1-Click Demo Profiles (For effortless testing) -->
          <div class="mb-6 p-3.5 bg-orange-50/70 rounded-2xl border border-orange-100">
            <p class="text-xs font-bold text-orange-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <i data-lucide="zap" class="w-3.5 h-3.5 text-orange-600"></i>
              Instant Demo Login (1-Click)
            </p>
            <div class="grid grid-cols-2 gap-2">
              ${students.map(s => `
                <button onclick="StudentModule.loginAs('${s.id}')" class="p-2 rounded-xl bg-white hover:bg-orange-100/50 border border-orange-200/80 text-left transition flex items-center gap-2">
                  <img src="${s.avatar}" class="w-8 h-8 rounded-full object-cover"/>
                  <div class="overflow-hidden">
                    <p class="text-xs font-bold text-slate-800 truncate">${s.name}</p>
                    <p class="text-[10px] text-slate-500 truncate">${s.rollNo}</p>
                  </div>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Auth Mode Switch Tabs -->
          <div class="flex rounded-xl bg-slate-100 p-1 mb-6 text-xs font-bold">
            <button onclick="App.navigate('student-login')" class="flex-1 py-2 rounded-lg transition ${mode === 'login' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}">
              Sign In
            </button>
            <button onclick="App.navigate('student-signup')" class="flex-1 py-2 rounded-lg transition ${mode === 'signup' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}">
              Sign Up (New)
            </button>
          </div>

          <!-- Form -->
          <form onsubmit="StudentModule.handleAuthSubmit(event, '${mode}')" class="space-y-4">
            ${mode === 'signup' ? `
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input id="auth-name" type="text" required placeholder="e.g. Rahul Sharma" class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"/>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Roll / Student ID</label>
                  <input id="auth-roll" type="text" required placeholder="e.g. 23-CS-108" class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"/>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <select id="auth-dept" class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white">
                    <option>Computer Science</option>
                    <option>Electronics</option>
                    <option>Mechanical</option>
                    <option>Civil Engg</option>
                    <option>Business / MBA</option>
                  </select>
                </div>
              </div>
            ` : ''}

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">College Email Address</label>
              <div class="relative">
                <i data-lucide="mail" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
                <input id="auth-email" type="email" required value="${mode === 'login' ? 'aarav.cs23@campus.edu' : ''}" placeholder="student@campus.edu" class="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"/>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div class="relative">
                <i data-lucide="lock" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
                <input id="auth-password" type="password" required value="${mode === 'login' ? 'campus123' : ''}" placeholder="••••••••" class="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"/>
              </div>
            </div>

            <button type="submit" class="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition flex items-center justify-center gap-2">
              <span>${mode === 'login' ? 'Sign In to Student Portal' : 'Register Account'}</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </form>

          <div class="mt-6 pt-4 border-t border-slate-100 text-center">
            <button onclick="App.navigate('staff-login')" class="text-xs text-slate-500 hover:text-orange-600 font-semibold transition flex items-center justify-center gap-1 mx-auto">
              <i data-lucide="chef-hat" class="w-3.5 h-3.5"></i>
              Are you Canteen Staff? Switch to Staff Login
            </button>
          </div>

        </div>
      </div>
    `;
  },

  // 3. Menu Page View
  renderMenu() {
    const allItems = CanteenStore.getMenu();
    const categories = SEED_DATA.categories;
    const cart = CanteenStore.getCart();
    const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
    const cartTotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const queueStats = CanteenStore.calculateQueueStats();

    // Filter items
    let filtered = allItems.filter(item => {
      // Category filter
      if (this.activeCategory !== 'all' && item.category !== this.activeCategory) {
        return false;
      }
      // Veg only filter
      if (this.filterVegOnly && !item.isVeg) {
        return false;
      }
      // Search query
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = (item.description || '').toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCategory) return false;
      }
      return true;
    });

    // Sorting
    if (this.sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === 'prep-time') {
      filtered.sort((a, b) => a.prepTime - b.prepTime);
    } else {
      // Popular / Bestsellers first
      filtered.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
    }

    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        <!-- Live Queue Announcement Ribbon -->
        <div class="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-2xl p-4 text-white shadow-md shadow-orange-500/15 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="flex items-center gap-3 text-center sm:text-left">
            <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <i data-lucide="clock" class="w-5 h-5 text-white"></i>
            </div>
            <div>
              <p class="font-extrabold text-sm sm:text-base">Kitchen Queue: ~${queueStats.estimatedWaitMins} mins wait</p>
              <p class="text-xs text-orange-100">${queueStats.activeCount} orders ahead. Order now to secure your pickup token!</p>
            </div>
          </div>
          <button onclick="App.navigate('my-orders')" class="px-4 py-2 rounded-xl bg-white text-orange-700 hover:bg-orange-50 font-bold text-xs shadow-sm transition whitespace-nowrap">
            View My Active Orders
          </button>
        </div>

        <!-- Header, Search & Filter Bar -->
        <div class="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm mb-6 space-y-4">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 class="text-2xl font-extrabold text-slate-900">Campus Canteen Menu</h2>
              <p class="text-xs text-slate-500">Freshly made meals, snacks, and chilled beverages</p>
            </div>

            <!-- Search Input -->
            <div class="relative flex-1 max-w-md">
              <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
              <input 
                id="menu-search-input" 
                type="text" 
                value="${this.searchQuery}" 
                placeholder="Search samosa, dosa, coffee, biryani..." 
                oninput="StudentModule.handleSearch(this.value)"
                class="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50/50"
              />
              ${this.searchQuery ? `
                <button onclick="StudentModule.handleSearch('')" class="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                  <i data-lucide="x" class="w-4 h-4"></i>
                </button>
              ` : ''}
            </div>
          </div>

          <!-- Category Chips & Dietary Toggle -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <!-- Categories -->
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              ${categories.map(cat => `
                <button 
                  onclick="StudentModule.setCategory('${cat.id}')" 
                  class="px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${this.activeCategory === cat.id ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
                >
                  ${cat.name}
                </button>
              `).join('')}
            </div>

            <!-- Veg Only Toggle & Sort -->
            <div class="flex items-center gap-3">
              <label class="inline-flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition select-none">
                <input 
                  type="checkbox" 
                  ${this.filterVegOnly ? 'checked' : ''} 
                  onchange="StudentModule.toggleVegOnly(this.checked)"
                  class="rounded text-green-600 focus:ring-green-500 h-4 w-4"
                />
                <span class="veg-badge scale-90"></span>
                <span>Pure Veg</span>
              </label>

              <select 
                onchange="StudentModule.setSort(this.value)" 
                class="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                <option value="popular" ${this.sortBy === 'popular' ? 'selected' : ''}>Popular First</option>
                <option value="prep-time" ${this.sortBy === 'prep-time' ? 'selected' : ''}>Fastest Prep ⏱️</option>
                <option value="price-low" ${this.sortBy === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
                <option value="price-high" ${this.sortBy === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Food Grid -->
        ${filtered.length === 0 ? `
          <div class="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto">
            <div class="w-16 h-16 mx-auto rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
              <i data-lucide="utensils-crossed" class="w-8 h-8"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900">No dishes match your filter</h3>
            <p class="text-xs text-slate-500 mt-1">Try searching for something else or clear the filters</p>
            <button onclick="StudentModule.resetFilters()" class="mt-4 px-4 py-2 rounded-xl bg-orange-600 text-white font-semibold text-xs shadow-sm">
              Reset Filters
            </button>
          </div>
        ` : `
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            ${filtered.map(item => {
              const inCartItem = cart.find(c => c.itemId === item.id);
              const qty = inCartItem ? inCartItem.quantity : 0;

              return `
                <div class="food-card bg-white rounded-2xl border ${item.inStock ? 'border-slate-200/80' : 'border-slate-200 opacity-75 bg-slate-50/50'} overflow-hidden shadow-sm flex flex-col justify-between relative">
                  
                  <!-- Thumbnail & Badges -->
                  <div class="relative h-44 overflow-hidden bg-slate-100">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover transition-transform duration-300 ${item.inStock ? 'hover:scale-105' : 'grayscale-[40%]'}" loading="lazy"/>
                    
                    <div class="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                      <div class="flex items-center gap-1.5">
                        <span class="${item.isVeg ? 'veg-badge' : 'non-veg-badge'}" title="${item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}"></span>
                        ${item.bestseller ? `
                          <span class="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold tracking-wide shadow-sm flex items-center gap-1">
                            <i data-lucide="flame" class="w-3 h-3"></i> Top Pick
                          </span>
                        ` : ''}
                      </div>
                    </div>

                    <div class="absolute bottom-3 right-3 flex items-center gap-1">
                      <span class="bg-black/75 backdrop-blur-sm text-white px-2 py-0.5 rounded-lg text-xs font-semibold flex items-center gap-1">
                        <i data-lucide="clock" class="w-3 h-3 text-orange-400"></i> ${item.prepTime}m
                      </span>
                    </div>

                    ${!item.inStock ? `
                      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center">
                        <span class="px-3.5 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg">
                          Sold Out Today
                        </span>
                      </div>
                    ` : ''}
                  </div>

                  <!-- Details -->
                  <div class="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div class="flex items-start justify-between gap-2">
                        <h3 class="font-bold text-slate-900 text-base leading-snug">${item.name}</h3>
                        <span class="text-base font-extrabold text-slate-900 whitespace-nowrap">₹${item.price}</span>
                      </div>
                      <p class="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">${item.description || ''}</p>
                    </div>

                    <!-- Cart Interaction Controls -->
                    <div class="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                      <span class="text-xs text-slate-400 font-medium">${item.calories || 250} kcal</span>

                      ${!item.inStock ? `
                        <button disabled class="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed">
                          Unavailable
                        </button>
                      ` : qty > 0 ? `
                        <div class="inline-flex items-center rounded-xl bg-orange-50 border border-orange-200 overflow-hidden shadow-sm">
                          <button onclick="StudentModule.updateQty('${item.id}', ${qty - 1})" class="w-8 h-8 flex items-center justify-center text-orange-700 hover:bg-orange-100 font-bold transition">
                            <i data-lucide="minus" class="w-3.5 h-3.5"></i>
                          </button>
                          <span class="px-2.5 text-xs font-extrabold text-orange-950">${qty}</span>
                          <button onclick="StudentModule.updateQty('${item.id}', ${qty + 1})" class="w-8 h-8 flex items-center justify-center text-orange-700 hover:bg-orange-100 font-bold transition">
                            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                          </button>
                        </div>
                      ` : `
                        <button onclick="StudentModule.handleQuickAdd('${item.id}')" class="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm shadow-orange-600/20 transition flex items-center gap-1.5">
                          <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                          Add
                        </button>
                      `}
                    </div>

                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}

        <!-- Floating Cart Bar (Bottom right or fixed bottom bar on mobile) -->
        ${cartCount > 0 ? `
          <div class="fixed bottom-6 right-6 z-40">
            <button onclick="App.navigate('cart')" class="px-5 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-2xl shadow-orange-600/50 flex items-center gap-3 transition transform hover:scale-105">
              <div class="relative">
                <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                <span class="absolute -top-2 -right-2 bg-white text-orange-700 w-5 h-5 rounded-full text-[11px] font-extrabold flex items-center justify-center shadow">
                  ${cartCount}
                </span>
              </div>
              <span>View Cart (${cartCount} items)</span>
              <span class="bg-orange-700/80 px-2 py-0.5 rounded-lg text-xs font-extrabold">₹${cartTotal}</span>
              <i data-lucide="chevron-right" class="w-4 h-4"></i>
            </button>
          </div>
        ` : ''}

      </div>
    `;
  },

  // 4. Cart and Checkout View
  renderCart() {
    const cart = CanteenStore.getCart();
    const student = CanteenStore.getCurrentStudent();
    const queueStats = CanteenStore.calculateQueueStats();

    if (cart.length === 0) {
      return `
        <div class="max-w-2xl mx-auto px-4 py-16 text-center">
          <div class="bg-white rounded-3xl p-10 border border-slate-200/80 shadow-sm">
            <div class="w-20 h-20 mx-auto rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
              <i data-lucide="shopping-bag" class="w-10 h-10"></i>
            </div>
            <h2 class="text-2xl font-extrabold text-slate-900">Your Cart is Empty</h2>
            <p class="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
              Looks like you haven't added any canteen treats yet. Browse our menu to get your meal started!
            </p>
            <button onclick="App.navigate('student-menu')" class="mt-6 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition inline-flex items-center gap-2">
              <i data-lucide="utensils" class="w-4 h-4"></i>
              Browse Canteen Menu
            </button>
          </div>
        </div>
      `;
    }

    // Calculations
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = this.discountApplied ? Math.round(subtotal * 0.10) : 0;
    const finalTotal = Math.max(0, subtotal - discountAmount);

    // Dynamic Pickup Calculation
    const prepTimes = cart.map(i => i.prepTime || 5);
    const pickupEstimate = CanteenStore.calculateEstimatedPickup(prepTimes);

    return `
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-extrabold text-slate-900">Review Your Cart</h2>
            <p class="text-xs text-slate-500">Confirm items and check estimated queue pickup time</p>
          </div>
          <button onclick="StudentModule.clearEntireCart()" class="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 hover:underline">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Clear Cart
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Items List Column -->
          <div class="lg:col-span-7 space-y-4">
            <div class="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm divide-y divide-slate-100">
              ${cart.map(item => `
                <div class="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <img src="${item.image}" alt="${item.name}" class="w-14 h-14 rounded-2xl object-cover border border-slate-100"/>
                    <div>
                      <div class="flex items-center gap-1.5">
                        <span class="${item.isVeg ? 'veg-badge scale-90' : 'non-veg-badge scale-90'}"></span>
                        <h4 class="font-bold text-slate-900 text-sm">${item.name}</h4>
                      </div>
                      <p class="text-xs text-slate-400 mt-0.5">⏱️ ${item.prepTime}m • ₹${item.price} each</p>
                    </div>
                  </div>

                  <!-- Controls -->
                  <div class="flex items-center gap-3">
                    <div class="inline-flex items-center rounded-xl bg-orange-50 border border-orange-200 overflow-hidden shadow-sm">
                      <button onclick="StudentModule.updateQty('${item.itemId}', ${item.quantity - 1})" class="w-7 h-7 flex items-center justify-center text-orange-700 hover:bg-orange-100 font-bold transition">
                        <i data-lucide="minus" class="w-3 h-3"></i>
                      </button>
                      <span class="px-2 text-xs font-bold text-orange-950">${item.quantity}</span>
                      <button onclick="StudentModule.updateQty('${item.itemId}', ${item.quantity + 1})" class="w-7 h-7 flex items-center justify-center text-orange-700 hover:bg-orange-100 font-bold transition">
                        <i data-lucide="plus" class="w-3 h-3"></i>
                      </button>
                    </div>
                    <span class="text-sm font-extrabold text-slate-900 w-14 text-right">₹${item.price * item.quantity}</span>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Cooking Instructions / Special Requests -->
            <div class="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
              <label class="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <i data-lucide="message-square" class="w-3.5 h-3.5 text-orange-600"></i>
                Special Kitchen Notes (Optional)
              </label>
              <input 
                id="order-notes" 
                type="text" 
                placeholder="e.g. Extra spicy, no onions, pack chutney separately..." 
                class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50/50"
              />
            </div>

            <!-- Order Preference (Dine In vs Takeaway) -->
            <div class="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
              <p class="text-xs font-bold text-slate-800 mb-2">Dining Preference</p>
              <div class="grid grid-cols-2 gap-3">
                <label class="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-orange-50/50 transition">
                  <input type="radio" name="pickup-type" value="Takeaway" checked class="text-orange-600 focus:ring-orange-500"/>
                  <div>
                    <p class="text-xs font-bold text-slate-800">Grab & Go (Takeaway)</p>
                    <p class="text-[10px] text-slate-500">Eco paper packaging</p>
                  </div>
                </label>
                <label class="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-orange-50/50 transition">
                  <input type="radio" name="pickup-type" value="Dine-in" class="text-orange-600 focus:ring-orange-500"/>
                  <div>
                    <p class="text-xs font-bold text-slate-800">Dine In (Counter Tray)</p>
                    <p class="text-[10px] text-slate-500">Eat at canteen table</p>
                  </div>
                </label>
              </div>
            </div>

          </div>

          <!-- Checkout & Pickup Estimate Summary -->
          <div class="lg:col-span-5 space-y-4">
            
            <!-- Smart Estimated Pickup Card -->
            <div class="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-5 text-white shadow-lg shadow-orange-500/20">
              <div class="flex items-center justify-between pb-3 border-b border-white/20">
                <span class="text-xs uppercase font-bold tracking-wider text-amber-100 flex items-center gap-1.5">
                  <i data-lucide="timer" class="w-4 h-4"></i>
                  Estimated Pickup
                </span>
                <span class="text-xs font-semibold bg-white/20 px-2.5 py-0.5 rounded-full">
                  ${queueStats.activeCount} orders ahead
                </span>
              </div>

              <div class="my-4 text-center">
                <p class="text-4xl font-extrabold tracking-tight">${pickupEstimate.formattedTime}</p>
                <p class="text-xs text-amber-100 mt-1">Ready in approximately <strong>${pickupEstimate.totalMinutes} mins</strong></p>
              </div>

              <div class="bg-black/20 rounded-2xl p-3 text-[11px] text-amber-50 flex items-center gap-2">
                <i data-lucide="info" class="w-4 h-4 flex-shrink-0 text-amber-200"></i>
                <span>Calculated automatically based on active kitchen load & prep time.</span>
              </div>
            </div>

            <!-- Bill Breakdown Card -->
            <div class="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3.5">
              <h3 class="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">Bill Details</h3>

              <div class="space-y-2 text-xs">
                <div class="flex justify-between text-slate-600">
                  <span>Item Subtotal</span>
                  <span class="font-bold text-slate-800">₹${subtotal}</span>
                </div>

                <!-- Student Discount Toggle -->
                <div class="flex justify-between items-center text-emerald-600 py-1">
                  <span class="flex items-center gap-1">
                    <i data-lucide="tag" class="w-3.5 h-3.5"></i>
                    Student Subsidy (10% off)
                  </span>
                  <span class="font-bold">-₹${discountAmount}</span>
                </div>

                <div class="flex justify-between text-slate-600">
                  <span>Canteen Convenience Fee</span>
                  <span class="font-bold text-emerald-600">FREE</span>
                </div>

                <div class="pt-3 border-t border-slate-100 flex justify-between items-center text-base">
                  <span class="font-bold text-slate-900">Total Payable</span>
                  <span class="font-extrabold text-orange-600 text-xl">₹${finalTotal}</span>
                </div>
              </div>

              <!-- Student Profile Confirmation -->
              <div class="p-3 bg-slate-50 rounded-2xl text-xs flex items-center justify-between border border-slate-100">
                <div class="flex items-center gap-2">
                  <img src="${student.avatar}" class="w-7 h-7 rounded-full object-cover"/>
                  <span class="font-semibold text-slate-800 truncate">${student.name}</span>
                </div>
                <span class="text-slate-500 font-mono">${student.rollNo}</span>
              </div>

              <!-- Place Order Button -->
              <button 
                onclick="StudentModule.handlePlaceOrder(${finalTotal}, ${subtotal}, ${discountAmount}, ${pickupEstimate.totalMinutes})"
                class="w-full py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm shadow-lg shadow-orange-600/30 transition flex items-center justify-center gap-2 transform active:scale-98"
              >
                <i data-lucide="check-circle-2" class="w-4 h-4"></i>
                <span>Place Order & Generate Token</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    `;
  },

  // 5. Order Confirmation View
  renderConfirmation(orderId) {
    const order = CanteenStore.getOrderById(orderId) || CanteenStore.getOrders()[0];
    if (!order) {
      return `<div class="p-12 text-center text-slate-500">Order not found.</div>`;
    }

    const estTime = new Date(order.estimatedPickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `
      <div class="max-w-2xl mx-auto px-4 py-8">
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl text-center relative overflow-hidden">
          
          <!-- Top Success Badge -->
          <div class="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 shadow-inner">
            <i data-lucide="check" class="w-8 h-8 stroke-[3]"></i>
          </div>

          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            Order Successfully Placed!
          </span>

          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Your Food is in Queue</h2>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">Please keep this token handy for pickup at the counter</p>

          <!-- Digital Token Box -->
          <div class="my-6 p-6 rounded-3xl token-chip max-w-sm mx-auto shadow-inner text-center">
            <p class="text-xs uppercase font-extrabold tracking-widest text-orange-800">Canteen Pickup Token</p>
            <p class="text-6xl font-black text-orange-600 my-1 font-mono tracking-wider">${order.tokenNumber}</p>
            <p class="text-xs font-semibold text-orange-900/70">Order ID: #${order.id} • ${order.counter || 'Counter 1'}</p>
          </div>

          <!-- Live Visual Status Stepper -->
          <div class="my-8 px-2 sm:px-6">
            ${this.renderStatusStepper(order.status)}
          </div>

          <!-- Order Summary Details -->
          <div class="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100 text-xs space-y-2">
            <div class="flex justify-between pb-2 border-b border-slate-200 font-bold text-slate-800">
              <span>Items Ordered (${order.items.length})</span>
              <span>₹${order.totalAmount}</span>
            </div>
            ${order.items.map(i => `
              <div class="flex justify-between text-slate-600">
                <span>${i.quantity}x ${i.name}</span>
                <span class="font-medium">₹${i.price * i.quantity}</span>
              </div>
            `).join('')}
            <div class="pt-2 border-t border-slate-200 flex justify-between text-slate-500">
              <span>Target Estimated Pickup:</span>
              <span class="font-bold text-orange-600">${estTime}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <button onclick="App.navigate('my-orders')" class="w-full sm:w-auto px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition flex items-center justify-center gap-2">
              <i data-lucide="clock" class="w-4 h-4"></i>
              Track Live in My Orders
            </button>
            <button onclick="App.navigate('student-menu')" class="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-2">
              <i data-lucide="plus" class="w-4 h-4"></i>
              Order More Items
            </button>
          </div>

        </div>
      </div>
    `;
  },

  // 6. My Orders View (Active orders with prominent ready banner & Past history)
  renderMyOrders() {
    const student = CanteenStore.getCurrentStudent();
    const allOrders = CanteenStore.getOrders();
    const studentOrders = allOrders.filter(o => o.studentId === student.id || o.studentRoll === student.rollNo);

    const activeOrders = studentOrders.filter(o => o.status !== 'collected');
    const pastOrders = studentOrders.filter(o => o.status === 'collected');

    // Check if any active order is Ready for Pickup
    const readyOrders = activeOrders.filter(o => o.status === 'ready');

    return `
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl font-extrabold text-slate-900">My Orders & Live Queue</h2>
            <p class="text-xs text-slate-500">Track current preparation status and view order history for ${student.name}</p>
          </div>
          <button onclick="App.navigate('student-menu')" class="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition inline-flex items-center gap-1.5 self-start">
            <i data-lucide="plus" class="w-4 h-4"></i> New Order
          </button>
        </div>

        <!-- PROMINENT READY FOR PICKUP BANNER -->
        ${readyOrders.length > 0 ? `
          <div class="ready-pulse bg-emerald-500 text-white rounded-3xl p-5 sm:p-6 shadow-xl shadow-emerald-500/25 border-2 border-emerald-400 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-4 text-center sm:text-left">
              <div class="w-14 h-14 rounded-2xl bg-white text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <i data-lucide="bell-ring" class="w-8 h-8 animate-bounce"></i>
              </div>
              <div>
                <span class="inline-block px-2.5 py-0.5 rounded-full bg-emerald-400/40 text-emerald-100 text-[10px] font-extrabold uppercase tracking-widest mb-1">
                  Food is Hot & Ready!
                </span>
                <h3 class="text-xl sm:text-2xl font-black">
                  Token #${readyOrders[0].tokenNumber} is READY FOR PICKUP!
                </h3>
                <p class="text-xs text-emerald-100 mt-1">
                  Please proceed to <strong>${readyOrders[0].counter || 'Counter 1'}</strong> immediately with Token #${readyOrders[0].tokenNumber}.
                </p>
              </div>
            </div>

            <button onclick="App.playAudioChime()" class="px-4 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs shadow-md transition flex items-center gap-1.5 whitespace-nowrap">
              <i data-lucide="volume-2" class="w-4 h-4 text-emerald-600"></i>
              Sound Alert
            </button>
          </div>
        ` : ''}

        <!-- Active Orders Section -->
        <div>
          <h3 class="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
            Active Orders (${activeOrders.length})
          </h3>

          ${activeOrders.length === 0 ? `
            <div class="bg-white rounded-3xl p-8 text-center border border-slate-200/80">
              <div class="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                <i data-lucide="check-circle" class="w-6 h-6"></i>
              </div>
              <p class="font-bold text-slate-700 text-sm">No Active Orders in Kitchen</p>
              <p class="text-xs text-slate-400 mt-1">Place an order from the menu to see live progress here.</p>
              <button onclick="App.navigate('student-menu')" class="mt-4 px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-sm">
                Order Food Now
              </button>
            </div>
          ` : `
            <div class="space-y-4">
              ${activeOrders.map(order => this.renderActiveOrderCard(order)).join('')}
            </div>
          `}
        </div>

        <!-- Past Order History Section -->
        <div class="pt-6">
          <h3 class="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
            <i data-lucide="history" class="w-4 h-4 text-slate-500"></i>
            Previous Orders (${pastOrders.length})
          </h3>

          ${pastOrders.length === 0 ? `
            <div class="bg-white rounded-3xl p-6 text-center border border-slate-200 text-xs text-slate-400">
              No previous orders yet.
            </div>
          ` : `
            <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
              ${pastOrders.map(order => `
                <div class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-slate-900 text-sm">Token #${order.tokenNumber}</span>
                      <span class="text-xs text-slate-400 font-mono">#${order.id}</span>
                      <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">Collected</span>
                    </div>
                    <p class="text-xs text-slate-500">
                      ${order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </p>
                    <p class="text-[11px] text-slate-400">
                      Ordered ${new Date(order.orderTime).toLocaleDateString()} at ${new Date(order.orderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div class="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0">
                    <span class="font-extrabold text-slate-900 text-sm">₹${order.totalAmount}</span>
                    <button onclick="StudentModule.handleReorder('${order.id}')" class="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white font-bold text-xs transition flex items-center gap-1.5">
                      <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> Re-order
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

      </div>
    `;
  },

  // Helper: Render an active order card with stepper
  renderActiveOrderCard(order) {
    const estTime = new Date(order.estimatedPickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isReady = order.status === 'ready';

    return `
      <div class="bg-white rounded-3xl p-5 sm:p-6 border ${isReady ? 'border-emerald-300 ring-2 ring-emerald-500/20' : 'border-slate-200/80'} shadow-sm space-y-4">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <span class="px-3 py-1.5 rounded-xl bg-orange-100 text-orange-800 font-mono font-black text-sm border border-orange-200">
              TOKEN #${order.tokenNumber}
            </span>
            <div>
              <h4 class="font-extrabold text-slate-900 text-sm">Order #${order.id}</h4>
              <p class="text-xs text-slate-400">${order.pickupType || 'Takeaway'} • Target Pickup: <strong class="text-slate-700">${estTime}</strong></p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              order.status === 'ready' ? 'bg-emerald-100 text-emerald-800 animate-pulse' :
              order.status === 'preparing' ? 'bg-amber-100 text-amber-800' :
              'bg-sky-100 text-sky-800'
            }">
              ${
                order.status === 'ready' ? 'Ready for Pickup 🎉' :
                order.status === 'preparing' ? 'Kitchen Preparing 👨‍🍳' :
                'Order Placed 📋'
              }
            </span>
          </div>
        </div>

        <!-- 4-Step Stepper -->
        <div class="py-2">
          ${this.renderStatusStepper(order.status)}
        </div>

        <!-- Items Summary List -->
        <div class="p-3 bg-slate-50 rounded-2xl text-xs space-y-1">
          <div class="flex justify-between font-bold text-slate-700 pb-1 border-b border-slate-200">
            <span>Items (${order.items.reduce((s, i) => s + i.quantity, 0)})</span>
            <span>Total: ₹${order.totalAmount}</span>
          </div>
          ${order.items.map(i => `
            <div class="flex justify-between text-slate-500">
              <span>${i.quantity}x ${i.name}</span>
              <span>₹${i.price * i.quantity}</span>
            </div>
          `).join('')}
          ${order.instructions ? `
            <p class="text-[11px] text-amber-700 font-medium pt-1 italic">
              Note: "${order.instructions}"
            </p>
          ` : ''}
        </div>

        <!-- Counter info -->
        <div class="flex items-center justify-between text-xs pt-1">
          <span class="text-slate-500">Pickup Location: <strong>${order.counter || 'Counter 1'}</strong></span>
          ${order.status === 'placed' ? `
            <button onclick="StudentModule.handleCancelOrder('${order.id}')" class="text-xs text-red-600 hover:text-red-700 font-semibold hover:underline">
              Cancel Order
            </button>
          ` : ''}
        </div>

      </div>
    `;
  },

  // Helper: Stepper Component
  renderStatusStepper(currentStatus) {
    const steps = [
      { key: 'placed', label: 'Order Placed', icon: 'clipboard-check' },
      { key: 'preparing', label: 'Preparing', icon: 'flame' },
      { key: 'ready', label: 'Ready for Pickup', icon: 'bell' },
      { key: 'collected', label: 'Collected', icon: 'check-circle-2' }
    ];

    const statusOrder = { 'placed': 0, 'preparing': 1, 'ready': 2, 'collected': 3 };
    const currentIndex = statusOrder[currentStatus] ?? 0;

    return `
      <div class="relative flex items-center justify-between max-w-lg mx-auto">
        <!-- Connecting Line -->
        <div class="absolute left-6 right-6 top-5 h-1 bg-slate-200 -z-0">
          <div class="h-full bg-orange-500 transition-all duration-500" style="width: ${(currentIndex / (steps.length - 1)) * 100}%"></div>
        </div>

        ${steps.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          let badgeClass = 'bg-slate-100 text-slate-400 border-slate-200';
          if (isDone) {
            badgeClass = 'bg-orange-500 text-white border-orange-500';
          } else if (isCurrent) {
            badgeClass = step.key === 'ready' 
              ? 'bg-emerald-500 text-white border-emerald-500 ring-4 ring-emerald-100 animate-bounce' 
              : 'bg-orange-600 text-white border-orange-600 ring-4 ring-orange-100 step-dot active';
          }

          return `
            <div class="flex flex-col items-center relative z-10">
              <div class="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${badgeClass}">
                <i data-lucide="${step.icon}" class="w-4 h-4"></i>
              </div>
              <span class="text-[11px] font-bold mt-2 text-center ${isCurrent ? 'text-orange-600' : isDone ? 'text-slate-800' : 'text-slate-400'}">
                ${step.label}
              </span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  // 7. Student Profile View
  renderProfile() {
    const student = CanteenStore.getCurrentStudent();
    const students = CanteenStore.getStudents();
    const allOrders = CanteenStore.getOrders();
    const studentOrders = allOrders.filter(o => o.studentId === student.id || o.studentRoll === student.rollNo);
    const totalSpent = studentOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const estimatedMinutesSaved = studentOrders.length * 15; // 15 mins saved per order skipped line

    return `
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        <!-- Profile Card -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img src="${student.avatar}" alt="${student.name}" class="w-24 h-24 rounded-3xl object-cover border-4 border-orange-100 shadow-md"/>
            
            <div class="flex-1 text-center sm:text-left space-y-1">
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider">
                <i data-lucide="badge-check" class="w-3.5 h-3.5 text-orange-600"></i>
                Verified Campus Student
              </div>
              <h2 class="text-2xl font-extrabold text-slate-900">${student.name}</h2>
              <p class="text-xs sm:text-sm text-slate-500 font-medium">${student.rollNo} • ${student.department} (${student.year || '3rd Year'})</p>
              
              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-3 text-xs text-slate-600">
                <span class="flex items-center gap-1.5">
                  <i data-lucide="mail" class="w-3.5 h-3.5 text-slate-400"></i> ${student.email}
                </span>
                <span class="flex items-center gap-1.5">
                  <i data-lucide="phone" class="w-3.5 h-3.5 text-slate-400"></i> ${student.phone}
                </span>
              </div>
            </div>

            <!-- Switch Student Demo Profile Dropdown -->
            <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-left">
              <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">Switch Demo Student</p>
              <select onchange="StudentModule.loginAs(this.value)" class="text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none">
                ${students.map(s => `
                  <option value="${s.id}" ${s.id === student.id ? 'selected' : ''}>${s.name} (${s.rollNo})</option>
                `).join('')}
              </select>
            </div>
          </div>
        </div>

        <!-- Campus Wallet & Queue Time Saved Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <!-- Campus Food Wallet -->
          <div class="bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-6 text-white shadow-lg shadow-orange-500/20">
            <div class="flex items-center justify-between pb-3 border-b border-white/20">
              <span class="text-xs uppercase font-extrabold tracking-wider text-orange-100 flex items-center gap-1.5">
                <i data-lucide="wallet" class="w-4 h-4"></i>
                Campus Wallet
              </span>
              <span class="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">1-Click Pay</span>
            </div>
            <p class="text-3xl sm:text-4xl font-black mt-4">₹${student.walletBalance || 420}</p>
            <p class="text-xs text-orange-100 mt-1">Available for contactless canteen orders</p>
            
            <div class="mt-4 pt-3 border-t border-white/20 flex gap-2">
              <button onclick="StudentModule.topUpWallet(100)" class="flex-1 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition">
                + ₹100
              </button>
              <button onclick="StudentModule.topUpWallet(200)" class="flex-1 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition">
                + ₹200
              </button>
            </div>
          </div>

          <!-- Total Orders Placed -->
          <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div class="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
                <i data-lucide="shopping-bag" class="w-5 h-5"></i>
              </div>
              <p class="text-xs uppercase font-bold text-slate-400 tracking-wider">Total Orders Placed</p>
              <p class="text-3xl font-extrabold text-slate-900 mt-1">${studentOrders.length} <span class="text-xs font-normal text-slate-500">orders</span></p>
            </div>
            <p class="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
              Total spent: <strong>₹${totalSpent}</strong>
            </p>
          </div>

          <!-- Queue Wait Time Saved -->
          <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div class="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                <i data-lucide="zap" class="w-5 h-5"></i>
              </div>
              <p class="text-xs uppercase font-bold text-slate-400 tracking-wider">Queue Time Saved</p>
              <p class="text-3xl font-extrabold text-emerald-600 mt-1">~${estimatedMinutesSaved} <span class="text-xs font-normal text-slate-500">mins</span></p>
            </div>
            <p class="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
              Skipped the physical counter queue!
            </p>
          </div>

        </div>

      </div>
    `;
  },

  // Handlers & Actions
  handleSearch(query) {
    this.searchQuery = query;
    App.render();
  },

  setCategory(catId) {
    this.activeCategory = catId;
    App.render();
  },

  toggleVegOnly(checked) {
    this.filterVegOnly = checked;
    App.render();
  },

  setSort(val) {
    this.sortBy = val;
    App.render();
  },

  resetFilters() {
    this.searchQuery = '';
    this.activeCategory = 'all';
    this.filterVegOnly = false;
    this.sortBy = 'popular';
    App.render();
  },

  handleQuickAdd(itemId) {
    const success = CanteenStore.addToCart(itemId, 1);
    if (success) {
      App.showToast('Item added to your cart!', 'success');
      App.render();
    } else {
      App.showToast('Item is currently out of stock', 'error');
    }
  },

  updateQty(itemId, newQty) {
    CanteenStore.updateCartQuantity(itemId, newQty);
    App.render();
  },

  clearEntireCart() {
    if (confirm('Clear all items from your cart?')) {
      CanteenStore.clearCart();
      App.showToast('Cart cleared', 'info');
      App.render();
    }
  },

  handlePlaceOrder(total, subtotal, discount, prepDuration) {
    const cart = CanteenStore.getCart();
    if (cart.length === 0) {
      App.showToast('Your cart is empty', 'error');
      return;
    }

    const student = CanteenStore.getCurrentStudent();
    const notesInput = document.getElementById('order-notes');
    const notes = notesInput ? notesInput.value.trim() : '';

    const pickupTypeRadio = document.querySelector('input[name="pickup-type"]:checked');
    const pickupType = pickupTypeRadio ? pickupTypeRadio.value : 'Takeaway';

    const orderSeq = Math.floor(Math.random() * 80) + 20; // 2 digit token
    const orderId = 'CB-' + (1000 + Math.floor(Math.random() * 900));

    const estDate = new Date(Date.now() + prepDuration * 60 * 1000);

    const newOrder = {
      id: orderId,
      tokenNumber: String(orderSeq),
      studentId: student.id,
      studentName: student.name,
      studentRoll: student.rollNo,
      studentPhone: student.phone,
      items: cart.map(c => ({
        id: c.itemId,
        name: c.name,
        price: c.price,
        quantity: c.quantity,
        prepTime: c.prepTime
      })),
      itemTotal: subtotal,
      discount: discount,
      totalAmount: total,
      instructions: notes,
      pickupType: pickupType,
      status: 'placed',
      orderTime: new Date().toISOString(),
      estimatedPickupTime: estDate.toISOString(),
      readyTime: null,
      collectedTime: null,
      counter: 'Counter 1'
    };

    // Deduct student wallet if sufficient, or proceed as campus food card
    if (student.walletBalance >= total) {
      student.walletBalance -= total;
      const students = CanteenStore.getStudents();
      const idx = students.findIndex(s => s.id === student.id);
      if (idx !== -1) {
        students[idx].walletBalance = student.walletBalance;
        CanteenStore.saveStudents(students);
      }
    }

    const orders = CanteenStore.getOrders();
    orders.unshift(newOrder);
    CanteenStore.saveOrders(orders);
    CanteenStore.clearCart();

    // Play chime and notify
    App.playAudioChime();
    App.showToast(`Order #${orderId} placed! Token #${newOrder.tokenNumber}`, 'success');

    // Broadcast new order to staff portal
    CanteenStore.broadcastChange('new_order_placed', { orderId: newOrder.id, token: newOrder.tokenNumber });

    // Navigate to confirmation page
    App.navigate('order-confirmation', { orderId: newOrder.id });
  },

  handleCancelOrder(orderId) {
    if (confirm('Are you sure you want to cancel this order?')) {
      const orders = CanteenStore.getOrders();
      const updated = orders.filter(o => o.id !== orderId);
      CanteenStore.saveOrders(updated);
      App.showToast('Order cancelled', 'info');
      App.render();
    }
  },

  handleReorder(pastOrderId) {
    const order = CanteenStore.getOrderById(pastOrderId);
    if (!order) return;
    
    order.items.forEach(i => {
      CanteenStore.addToCart(i.id, i.quantity);
    });

    App.showToast('Previous items added to cart!', 'success');
    App.navigate('cart');
  },

  loginAs(studentId) {
    CanteenStore.setCurrentStudent(studentId);
    const student = CanteenStore.getCurrentStudent();
    App.showToast(`Logged in as ${student.name}`, 'success');
    App.navigate('student-menu');
  },

  handleAuthSubmit(e, mode) {
    e.preventDefault();
    if (mode === 'signup') {
      const name = document.getElementById('auth-name').value.trim();
      const roll = document.getElementById('auth-roll').value.trim();
      const dept = document.getElementById('auth-dept').value;
      const email = document.getElementById('auth-email').value.trim();

      const newStudent = {
        id: 'stud-' + Date.now(),
        name: name,
        email: email,
        phone: '+91 98' + Math.floor(10000000 + Math.random() * 90000000),
        rollNo: roll,
        department: dept,
        year: '1st Year',
        walletBalance: 500,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      };

      const students = CanteenStore.getStudents();
      students.push(newStudent);
      CanteenStore.saveStudents(students);
      CanteenStore.setCurrentStudent(newStudent.id);
      App.showToast(`Welcome ${name}! Account created with ₹500 welcome balance`, 'success');
    } else {
      App.showToast('Logged in successfully!', 'success');
    }
    App.navigate('student-menu');
  },

  topUpWallet(amount) {
    const student = CanteenStore.getCurrentStudent();
    student.walletBalance = (student.walletBalance || 0) + amount;
    const students = CanteenStore.getStudents();
    const idx = students.findIndex(s => s.id === student.id);
    if (idx !== -1) {
      students[idx].walletBalance = student.walletBalance;
      CanteenStore.saveStudents(students);
    }
    App.showToast(`Added ₹${amount} to your Campus Wallet!`, 'success');
    App.render();
  }
};
