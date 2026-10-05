/**
 * Smart Queue Management for College Canteens - Staff Module
 * Manages Staff Auth, Kitchen Dashboard KPI metrics, Incoming Orders Board with Status Transitions,
 * Menu Management CRUD, and Queue Configuration.
 */

const StaffModule = {
  activeOrderTab: 'all', // 'all' | 'placed' | 'preparing' | 'ready' | 'collected'
  orderSearchQuery: '',
  editingItemId: null,
  menuSearchQuery: '',
  menuFilterCategory: 'all',

  init() {
    // Setup staff listeners if needed
  },

  // 1. Staff Login View
  renderAuth() {
    const staffMembers = SEED_DATA.demoStaff;

    return `
      <div class="max-w-md mx-auto my-8 sm:my-14 px-4">
        <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80">
          
          <div class="text-center mb-6">
            <div class="w-14 h-14 mx-auto rounded-2xl bg-orange-600 text-white flex items-center justify-center font-bold text-2xl mb-3 shadow-md shadow-orange-600/30">
              <i data-lucide="chef-hat" class="w-7 h-7"></i>
            </div>
            <h2 class="text-2xl font-extrabold text-slate-900">Canteen Staff Portal</h2>
            <p class="text-xs sm:text-sm text-slate-500 mt-1">Kitchen display & order queue management</p>
          </div>

          <!-- Quick 1-Click Demo Staff Logins -->
          <div class="mb-6 p-3.5 bg-orange-50 rounded-2xl border border-orange-100">
            <p class="text-xs font-bold text-orange-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <i data-lucide="zap" class="w-3.5 h-3.5 text-orange-600"></i>
              Instant Staff Quick Login (1-Click)
            </p>
            <div class="grid grid-cols-1 gap-2">
              ${staffMembers.map(s => `
                <button onclick="StaffModule.loginAs('${s.id}')" class="p-2.5 rounded-xl bg-white hover:bg-orange-100/50 border border-orange-200 text-left transition flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <img src="${s.avatar}" class="w-9 h-9 rounded-full object-cover"/>
                    <div>
                      <p class="text-xs font-bold text-slate-800">${s.name}</p>
                      <p class="text-[10px] text-orange-700 font-medium">${s.role} • ${s.counter}</p>
                    </div>
                  </div>
                  <span class="text-xs font-bold text-orange-600 px-2 py-1 bg-orange-50 rounded-lg">Enter &rarr;</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Login Form -->
          <form onsubmit="StaffModule.handleAuthSubmit(event)" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Staff Work Email or ID</label>
              <div class="relative">
                <i data-lucide="user-check" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
                <input id="staff-auth-email" type="text" required value="chef.ramesh@campus.edu" class="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"/>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Security PIN / Password</label>
              <div class="relative">
                <i data-lucide="lock" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
                <input id="staff-auth-pin" type="password" required value="CHEF123" class="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"/>
              </div>
            </div>

            <button type="submit" class="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition flex items-center justify-center gap-2">
              <span>Enter Staff Dashboard</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </form>

          <div class="mt-6 pt-4 border-t border-slate-100 text-center">
            <button onclick="App.navigate('student-menu')" class="text-xs text-slate-500 hover:text-orange-600 font-semibold transition flex items-center justify-center gap-1 mx-auto">
              <i data-lucide="graduation-cap" class="w-3.5 h-3.5"></i>
              Are you a Student? Switch to Student Menu
            </button>
          </div>

        </div>
      </div>
    `;
  },

  // 2. Staff Dashboard View (Summary KPI cards, Queue Overview, Quick Actions)
  renderDashboard() {
    const queueStats = CanteenStore.calculateQueueStats();
    const staff = CanteenStore.getCurrentStaff();
    const settings = CanteenStore.getSettings();

    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        <!-- Top Bar with Staff info & Rush Hour Toggle -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <img src="${staff.avatar}" class="w-14 h-14 rounded-2xl object-cover border-2 border-orange-200 shadow-sm"/>
            <div>
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wide">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Station Online
                </span>
                <span class="text-xs text-slate-400">${staff.counter}</span>
              </div>
              <h2 class="text-xl font-extrabold text-slate-900">${staff.name}</h2>
              <p class="text-xs text-slate-500">${staff.role}</p>
            </div>
          </div>

          <!-- Rush Hour & Sound Controls -->
          <div class="flex flex-wrap items-center gap-3">
            <!-- Rush Hour Toggle -->
            <button 
              onclick="StaffModule.toggleRushHour()" 
              class="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border transition ${settings.rushHour ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/25' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'}"
            >
              <i data-lucide="flame" class="w-4 h-4 ${settings.rushHour ? 'animate-bounce' : 'text-amber-500'}"></i>
              <span>${settings.rushHour ? 'Rush Hour ACTIVE (+3.5m queue)' : 'Rush Hour: Normal Flow'}</span>
            </button>

            <!-- Sound Alert Toggle -->
            <button 
              onclick="StaffModule.toggleSound()" 
              class="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5"
              title="Toggle Audio Notifications"
            >
              <i data-lucide="${settings.soundEnabled !== false ? 'volume-2' : 'volume-x'}" class="w-4 h-4 text-orange-600"></i>
              <span>${settings.soundEnabled !== false ? 'Audio On' : 'Audio Off'}</span>
            </button>

            <!-- Quick Action Links -->
            <button onclick="App.navigate('staff-orders')" class="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition flex items-center gap-2">
              <i data-lucide="clipboard-list" class="w-4 h-4"></i>
              <span>Incoming Orders (${queueStats.placedCount + queueStats.preparingCount})</span>
            </button>
          </div>
        </div>

        <!-- KPI Metrics Summary Cards (Total Today, Placed, Preparing, Ready, Completed, Revenue, Wait Time) -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          
          <!-- Total Today -->
          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Today</p>
            <p class="text-2xl font-black text-slate-900 mt-1">${queueStats.totalOrdersToday}</p>
            <span class="text-[10px] text-slate-400 mt-1 block">All orders logged</span>
          </div>

          <!-- New Orders (Placed) -->
          <div class="bg-sky-50/70 p-4 rounded-2xl border border-sky-100 shadow-sm relative overflow-hidden cursor-pointer hover:border-sky-300 transition" onclick="StaffModule.goToTab('placed')">
            <div class="flex items-center justify-between">
              <p class="text-[11px] font-bold text-sky-800 uppercase tracking-wider">New (Placed)</p>
              ${queueStats.placedCount > 0 ? `<span class="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>` : ''}
            </div>
            <p class="text-2xl font-black text-sky-950 mt-1">${queueStats.placedCount}</p>
            <span class="text-[10px] text-sky-700 mt-1 block">Awaiting kitchen accept</span>
          </div>

          <!-- Preparing (Kitchen) -->
          <div class="bg-amber-50/70 p-4 rounded-2xl border border-amber-100 shadow-sm cursor-pointer hover:border-amber-300 transition" onclick="StaffModule.goToTab('preparing')">
            <p class="text-[11px] font-bold text-amber-800 uppercase tracking-wider">In Kitchen</p>
            <p class="text-2xl font-black text-amber-950 mt-1">${queueStats.preparingCount}</p>
            <span class="text-[10px] text-amber-700 mt-1 block">Currently on burners</span>
          </div>

          <!-- Ready for Pickup -->
          <div class="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-100 shadow-sm cursor-pointer hover:border-emerald-300 transition" onclick="StaffModule.goToTab('ready')">
            <p class="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Ready Pickup</p>
            <p class="text-2xl font-black text-emerald-950 mt-1">${queueStats.readyCount}</p>
            <span class="text-[10px] text-emerald-700 mt-1 block">Waiting at counter</span>
          </div>

          <!-- Completed -->
          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 shadow-sm cursor-pointer hover:border-slate-300 transition" onclick="StaffModule.goToTab('collected')">
            <p class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Handed Over</p>
            <p class="text-2xl font-black text-slate-800 mt-1">${queueStats.completedCount}</p>
            <span class="text-[10px] text-slate-400 mt-1 block">Successfully served</span>
          </div>

          <!-- Revenue Today -->
          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Today's Sales</p>
            <p class="text-2xl font-black text-orange-600 mt-1">₹${queueStats.revenueToday}</p>
            <span class="text-[10px] text-slate-400 mt-1 block">Collected revenue</span>
          </div>

        </div>

        <!-- Live Queue Overview & Bottleneck Monitor -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- Kitchen Queue Load Overview -->
          <div class="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 class="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <i data-lucide="gauge" class="w-5 h-5 text-orange-500"></i>
                  Live Queue Wait-Time Algorithm
                </h3>
                <p class="text-xs text-slate-500">Dynamically broadcasted to student app based on backlog</p>
              </div>

              <span class="px-3 py-1 rounded-full text-xs font-bold ${queueStats.activeCount > 6 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}">
                ${queueStats.activeCount > 6 ? 'Moderate Load' : 'Optimal Capacity'}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <span class="text-xs font-bold text-slate-500 uppercase">Active Kitchen Load</span>
                <p class="text-3xl font-extrabold text-slate-900 mt-1">${queueStats.activeCount} orders</p>
                <p class="text-[11px] text-slate-400 mt-1">Pending + Cooking</p>
              </div>

              <div class="p-4 rounded-2xl bg-orange-50 border border-orange-100 text-center">
                <span class="text-xs font-bold text-orange-700 uppercase">Current Estimated Wait</span>
                <p class="text-3xl font-extrabold text-orange-600 mt-1">~${queueStats.estimatedWaitMins} mins</p>
                <p class="text-[11px] text-orange-600/70 mt-1">Shown to students</p>
              </div>

              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <span class="text-xs font-bold text-slate-500 uppercase">Active Counters</span>
                <p class="text-3xl font-extrabold text-slate-900 mt-1">2 Stations</p>
                <p class="text-[11px] text-slate-400 mt-1">Main & Express</p>
              </div>
            </div>

            <!-- Wait time formula explanation -->
            <div class="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 text-xs text-amber-900 space-y-1">
              <p class="font-bold flex items-center gap-1.5">
                <i data-lucide="info" class="w-4 h-4 text-amber-600"></i>
                Queue Calculation Formula:
              </p>
              <p class="text-[11px] text-amber-800 leading-relaxed">
                Est. Pickup Time = Current Time + (Active Kitchen Orders × ${settings.rushHour ? '3.5' : '2.5'} mins) + Max Dish Prep Time. When staff changes order status to "Ready for Pickup", the student tab triggers an instant sound and notification banner.
              </p>
            </div>
          </div>

          <!-- Quick Navigation & Menu Health -->
          <div class="lg:col-span-4 space-y-4">
            <!-- Fast Menu Management Shortcut -->
            <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h3 class="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <i data-lucide="settings" class="w-5 h-5 text-orange-500"></i>
                Canteen Quick Controls
              </h3>

              <div class="space-y-2">
                <button onclick="App.navigate('staff-orders')" class="w-full p-3 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold text-xs flex items-center justify-between transition">
                  <span class="flex items-center gap-2">
                    <i data-lucide="clipboard-list" class="w-4 h-4 text-orange-600"></i>
                    Open Orders Board
                  </span>
                  <span class="px-2 py-0.5 rounded-full bg-orange-600 text-white text-[10px]">
                    ${queueStats.activeCount} active
                  </span>
                </button>

                <button onclick="App.navigate('staff-menu')" class="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-between transition border border-slate-200">
                  <span class="flex items-center gap-2">
                    <i data-lucide="utensils" class="w-4 h-4 text-slate-600"></i>
                    Menu & Inventory Manager
                  </span>
                  <span class="text-xs text-slate-400">
                    ${CanteenStore.getMenu().length} items
                  </span>
                </button>

                <button onclick="CanteenStore.resetDefaults(); App.showToast('Seed data reset!', 'info'); App.render();" class="w-full p-3 rounded-2xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-medium text-xs flex items-center justify-between transition border border-slate-200">
                  <span class="flex items-center gap-2">
                    <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
                    Reset Sample Demo Data
                  </span>
                  <span class="text-[10px] text-slate-400">Restore</span>
                </button>
              </div>
            </div>

            <!-- Out of Stock Alert Summary -->
            <div class="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
              <p class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Inventory Stock Status</p>
              ${(() => {
                const outOfStock = CanteenStore.getMenu().filter(i => !i.inStock);
                if (outOfStock.length === 0) {
                  return `<p class="text-xs text-emerald-600 font-medium">All menu items are currently in stock!</p>`;
                }
                return `
                  <div class="space-y-1.5">
                    <p class="text-xs text-amber-700 font-semibold">${outOfStock.length} items marked Out of Stock:</p>
                    ${outOfStock.map(i => `
                      <div class="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-50 border border-slate-100">
                        <span class="font-medium text-slate-800">${i.name}</span>
                        <button onclick="StaffModule.toggleItemStock('${i.id}')" class="text-[10px] font-bold text-orange-600 hover:underline">
                          Restock
                        </button>
                      </div>
                    `).join('')}
                  </div>
                `;
              })()}
            </div>

          </div>

        </div>

        <!-- Recent Incoming Orders Quick Table -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 class="font-extrabold text-slate-900 text-base">Active Orders Quick View</h3>
              <p class="text-xs text-slate-500">Live feed from counter & kitchen</p>
            </div>
            <button onclick="App.navigate('staff-orders')" class="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
              View Full Orders Board &rarr;
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="text-slate-400 uppercase tracking-wider font-bold border-b border-slate-100">
                  <th class="pb-2.5">Token #</th>
                  <th class="pb-2.5">Student</th>
                  <th class="pb-2.5">Dishes Ordered</th>
                  <th class="pb-2.5">Time Placed</th>
                  <th class="pb-2.5">Status</th>
                  <th class="pb-2.5 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${CanteenStore.getOrders().slice(0, 5).map(o => `
                  <tr class="hover:bg-slate-50/70 transition">
                    <td class="py-3 font-mono font-black text-orange-600 text-sm">#${o.tokenNumber}</td>
                    <td class="py-3 font-bold text-slate-800">${o.studentName} <span class="block text-[10px] font-normal text-slate-400">${o.studentRoll}</span></td>
                    <td class="py-3 text-slate-600 max-w-xs truncate">${o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</td>
                    <td class="py-3 text-slate-400 font-mono">${new Date(o.orderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td class="py-3">
                      <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        o.status === 'ready' ? 'bg-emerald-100 text-emerald-800' :
                        o.status === 'preparing' ? 'bg-amber-100 text-amber-800' :
                        o.status === 'placed' ? 'bg-sky-100 text-sky-800' :
                        'bg-slate-100 text-slate-600'
                      }">
                        ${o.status}
                      </span>
                    </td>
                    <td class="py-3 text-right">
                      ${o.status === 'placed' ? `
                        <button onclick="StaffModule.updateOrderStatus('${o.id}', 'preparing')" class="px-3 py-1 rounded-xl bg-orange-600 text-white font-bold text-[11px] shadow-sm hover:bg-orange-700">
                          Start Prep
                        </button>
                      ` : o.status === 'preparing' ? `
                        <button onclick="StaffModule.updateOrderStatus('${o.id}', 'ready')" class="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold text-[11px] shadow-sm hover:bg-emerald-700">
                          Mark Ready
                        </button>
                      ` : o.status === 'ready' ? `
                        <button onclick="StaffModule.updateOrderStatus('${o.id}', 'collected')" class="px-3 py-1 rounded-xl bg-slate-800 text-white font-bold text-[11px] shadow-sm hover:bg-slate-900">
                          Collect
                        </button>
                      ` : `
                        <span class="text-slate-400 text-[11px]">Served</span>
                      `}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  },

  // 3. Incoming Orders Board View (Kanban / Filter tabs, Status progression)
  renderOrders() {
    const allOrders = CanteenStore.getOrders();
    const queueStats = CanteenStore.calculateQueueStats();

    // Filter by tab
    let filtered = allOrders.filter(order => {
      if (this.activeOrderTab !== 'all' && order.status !== this.activeOrderTab) {
        return false;
      }
      if (this.orderSearchQuery) {
        const q = this.orderSearchQuery.toLowerCase();
        const matchesToken = (order.tokenNumber || '').toLowerCase().includes(q);
        const matchesId = (order.id || '').toLowerCase().includes(q);
        const matchesName = (order.studentName || '').toLowerCase().includes(q);
        const matchesRoll = (order.studentRoll || '').toLowerCase().includes(q);
        if (!matchesToken && !matchesId && !matchesName && !matchesRoll) return false;
      }
      return true;
    });

    const tabs = [
      { id: 'all', label: 'All Orders', count: allOrders.length },
      { id: 'placed', label: 'New (Placed)', count: queueStats.placedCount },
      { id: 'preparing', label: 'Preparing', count: queueStats.preparingCount },
      { id: 'ready', label: 'Ready for Pickup', count: queueStats.readyCount },
      { id: 'collected', label: 'Completed', count: queueStats.completedCount }
    ];

    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        <!-- Header & Search -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-2xl font-extrabold text-slate-900">Kitchen & Counter Order Board</h2>
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Live Synced"></span>
            </div>
            <p class="text-xs text-slate-500">Live order queue. Advance status to notify students instantly.</p>
          </div>

          <!-- Search Order Input -->
          <div class="relative max-w-xs w-full">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
            <input 
              type="text" 
              placeholder="Search Token #, Name, Roll..." 
              value="${this.orderSearchQuery}" 
              oninput="StaffModule.handleOrderSearch(this.value)"
              class="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
            />
          </div>
        </div>

        <!-- Order Tabs -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
          ${tabs.map(tab => `
            <button 
              onclick="StaffModule.setActiveOrderTab('${tab.id}')" 
              class="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${this.activeOrderTab === tab.id ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}"
            >
              <span>${tab.label}</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] ${this.activeOrderTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}">
                ${tab.count}
              </span>
            </button>
          `).join('')}
        </div>

        <!-- Order Cards Grid -->
        ${filtered.length === 0 ? `
          <div class="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto">
            <div class="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
              <i data-lucide="check-check" class="w-6 h-6"></i>
            </div>
            <p class="font-bold text-slate-800 text-base">No orders in this category</p>
            <p class="text-xs text-slate-400 mt-1">Orders placed by students will show up here automatically.</p>
          </div>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${filtered.map(order => this.renderStaffOrderCard(order)).join('')}
          </div>
        `}

      </div>
    `;
  },

  // Helper: Individual Staff Order Card with Full Action Lifecycle
  renderStaffOrderCard(order) {
    const elapsedMinutes = Math.round((Date.now() - new Date(order.orderTime).getTime()) / 60000);
    const estTime = new Date(order.estimatedPickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let borderClass = 'border-slate-200/80';
    let statusBadge = 'bg-sky-100 text-sky-800';

    if (order.status === 'ready') {
      borderClass = 'border-emerald-300 ring-2 ring-emerald-500/20';
      statusBadge = 'bg-emerald-100 text-emerald-800 font-extrabold';
    } else if (order.status === 'preparing') {
      borderClass = 'border-amber-300 ring-1 ring-amber-400/20';
      statusBadge = 'bg-amber-100 text-amber-800';
    } else if (order.status === 'collected') {
      borderClass = 'border-slate-200 opacity-80';
      statusBadge = 'bg-slate-100 text-slate-600';
    }

    return `
      <div class="bg-white rounded-3xl p-5 sm:p-6 border ${borderClass} shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
        
        <!-- Card Header -->
        <div class="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 rounded-xl bg-orange-100 text-orange-900 font-mono font-black text-sm border border-orange-200">
                TOKEN #${order.tokenNumber}
              </span>
              <span class="text-xs font-mono text-slate-400">#${order.id}</span>
            </div>
            <h4 class="font-extrabold text-slate-900 text-base mt-2">${order.studentName}</h4>
            <p class="text-xs text-slate-500">${order.studentRoll} • ${order.studentPhone}</p>
          </div>

          <div class="text-right">
            <span class="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusBadge}">
              ${order.status}
            </span>
            <span class="block text-[11px] text-slate-400 mt-1 font-mono">${elapsedMinutes}m ago</span>
          </div>
        </div>

        <!-- Food Items List -->
        <div class="bg-slate-50 rounded-2xl p-3 text-xs space-y-1.5 border border-slate-100">
          <div class="flex justify-between font-bold text-slate-700 pb-1 border-b border-slate-200">
            <span>Ordered Dishes</span>
            <span>Total: ₹${order.totalAmount}</span>
          </div>

          ${order.items.map(item => `
            <div class="flex justify-between items-center text-slate-700">
              <span class="font-semibold text-slate-900">${item.quantity}x ${item.name}</span>
              <span class="text-slate-400 font-mono text-[11px]">⏱️ ${item.prepTime}m</span>
            </div>
          `).join('')}

          ${order.instructions ? `
            <div class="pt-1.5 border-t border-slate-200/80 text-[11px] text-amber-800 font-medium">
              ⚠️ Kitchen Note: <span class="italic font-normal">${order.instructions}</span>
            </div>
          ` : ''}
        </div>

        <!-- Meta: Pickup Type & Target Time -->
        <div class="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>Type: <strong class="text-slate-800">${order.pickupType || 'Takeaway'}</strong></span>
          <span>Target: <strong class="text-orange-600 font-mono">${estTime}</strong></span>
        </div>

        <!-- Status Progression Action Buttons -->
        <div class="pt-2 border-t border-slate-100 flex flex-col gap-2">
          ${order.status === 'placed' ? `
            <button 
              onclick="StaffModule.updateOrderStatus('${order.id}', 'preparing')" 
              class="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition flex items-center justify-center gap-2"
            >
              <i data-lucide="flame" class="w-4 h-4"></i>
              <span>Accept & Start Preparing</span>
            </button>
          ` : order.status === 'preparing' ? `
            <button 
              onclick="StaffModule.updateOrderStatus('${order.id}', 'ready')" 
              class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition flex items-center justify-center gap-2 animate-pulse"
            >
              <i data-lucide="bell-ring" class="w-4 h-4"></i>
              <span>Mark Ready for Pickup (Alert Student)</span>
            </button>
          ` : order.status === 'ready' ? `
            <button 
              onclick="StaffModule.updateOrderStatus('${order.id}', 'collected')" 
              class="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
            >
              <i data-lucide="check-circle" class="w-4 h-4"></i>
              <span>Mark as Handed Over / Collected</span>
            </button>
          ` : `
            <div class="py-2 text-center text-xs text-slate-400 font-semibold flex items-center justify-center gap-1.5">
              <i data-lucide="check-check" class="w-4 h-4 text-emerald-500"></i>
              Completed & Picked Up
            </div>
          `}

          <!-- Counter Assignment Selector -->
          ${order.status !== 'collected' ? `
            <div class="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Counter:</span>
              <select onchange="StaffModule.assignCounter('${order.id}', this.value)" class="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-0.5 focus:outline-none">
                <option value="Counter 1" ${order.counter === 'Counter 1' ? 'selected' : ''}>Counter 1 (Main)</option>
                <option value="Counter 2" ${order.counter === 'Counter 2' ? 'selected' : ''}>Counter 2 (Quick Bites)</option>
                <option value="Beverage Counter" ${order.counter === 'Beverage Counter' ? 'selected' : ''}>Beverage Counter</option>
              </select>
            </div>
          ` : ''}
        </div>

      </div>
    `;
  },

  // 4. Menu Management Section (Add, Edit, Delete, Toggle Out of Stock)
  renderMenuManagement() {
    const items = CanteenStore.getMenu();
    const categories = SEED_DATA.categories;

    // Filter items
    let filtered = items.filter(item => {
      if (this.menuFilterCategory !== 'all' && item.category !== this.menuFilterCategory) {
        return false;
      }
      if (this.menuSearchQuery) {
        const q = this.menuSearchQuery.toLowerCase();
        if (!item.name.toLowerCase().includes(q) && !(item.description || '').toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });

    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl font-extrabold text-slate-900">Canteen Menu & Stock Management</h2>
            <p class="text-xs text-slate-500">Add dishes, modify pricing & prep times, or mark out-of-stock items</p>
          </div>

          <div class="flex items-center gap-3">
            <button onclick="StaffModule.openAddItemModal()" class="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition flex items-center gap-2">
              <i data-lucide="plus" class="w-4 h-4"></i>
              <span>Add New Food Item</span>
            </button>
            <button onclick="CanteenStore.resetDefaults(); App.showToast('Menu reset to college default', 'info'); App.render();" class="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs transition">
              Reset Menu
            </button>
          </div>
        </div>

        <!-- Search and Filter Bar -->
        <div class="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="relative max-w-sm w-full">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
            <input 
              type="text" 
              placeholder="Search menu items..." 
              value="${this.menuSearchQuery}" 
              oninput="StaffModule.handleMenuSearch(this.value)"
              class="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50/50"
            />
          </div>

          <!-- Category filter -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            ${categories.map(cat => `
              <button 
                onclick="StaffModule.setMenuCategoryFilter('${cat.id}')" 
                class="px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${this.menuFilterCategory === cat.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
              >
                ${cat.name}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Items Table -->
        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50/70 border-b border-slate-100">
                <tr class="text-slate-400 uppercase tracking-wider font-bold">
                  <th class="py-3 px-5">Dish</th>
                  <th class="py-3 px-4">Category</th>
                  <th class="py-3 px-4">Price</th>
                  <th class="py-3 px-4">Prep Time</th>
                  <th class="py-3 px-4">Stock Availability</th>
                  <th class="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${filtered.map(item => `
                  <tr class="hover:bg-slate-50/60 transition ${!item.inStock ? 'bg-slate-50/40 text-slate-400' : ''}">
                    <!-- Dish Name & Image -->
                    <td class="py-3.5 px-5">
                      <div class="flex items-center gap-3">
                        <img src="${item.image}" alt="${item.name}" class="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"/>
                        <div>
                          <div class="flex items-center gap-1.5">
                            <span class="${item.isVeg ? 'veg-badge scale-75' : 'non-veg-badge scale-75'}"></span>
                            <span class="font-extrabold text-slate-900 text-sm">${item.name}</span>
                            ${item.bestseller ? `<span class="text-[10px] text-amber-600 font-bold">★ Bestseller</span>` : ''}
                          </div>
                          <p class="text-[11px] text-slate-400 line-clamp-1 max-w-xs mt-0.5">${item.description || ''}</p>
                        </div>
                      </div>
                    </td>

                    <!-- Category -->
                    <td class="py-3.5 px-4">
                      <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold capitalize text-[11px]">
                        ${item.category}
                      </span>
                    </td>

                    <!-- Price -->
                    <td class="py-3.5 px-4 font-black text-slate-900 text-sm">
                      ₹${item.price}
                    </td>

                    <!-- Prep Time -->
                    <td class="py-3.5 px-4 font-semibold text-slate-600">
                      ⏱️ ${item.prepTime} mins
                    </td>

                    <!-- Stock Availability Toggle Switch -->
                    <td class="py-3.5 px-4">
                      <button 
                        onclick="StaffModule.toggleItemStock('${item.id}')" 
                        class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                          item.inStock 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100' 
                            : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                        }"
                      >
                        <span class="w-2 h-2 rounded-full ${item.inStock ? 'bg-emerald-500' : 'bg-rose-500'}"></span>
                        <span>${item.inStock ? 'In Stock (Active)' : 'Out of Stock'}</span>
                      </button>
                    </td>

                    <!-- Actions -->
                    <td class="py-3.5 px-5 text-right whitespace-nowrap">
                      <div class="inline-flex items-center gap-1.5">
                        <button onclick="StaffModule.openEditItemModal('${item.id}')" class="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition" title="Edit Item">
                          <i data-lucide="edit-3" class="w-4 h-4"></i>
                        </button>
                        <button onclick="StaffModule.deleteItem('${item.id}')" class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition" title="Delete Item">
                          <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- Add / Edit Modal Container -->
      <div id="item-modal-container"></div>
    `;
  },

  // Handlers & State Changes
  setActiveOrderTab(tab) {
    this.activeOrderTab = tab;
    App.render();
  },

  goToTab(tab) {
    this.activeOrderTab = tab;
    App.navigate('staff-orders');
  },

  handleOrderSearch(val) {
    this.orderSearchQuery = val;
    App.render();
  },

  handleMenuSearch(val) {
    this.menuSearchQuery = val;
    App.render();
  },

  setMenuCategoryFilter(cat) {
    this.menuFilterCategory = cat;
    App.render();
  },

  updateOrderStatus(orderId, newStatus) {
    const orders = CanteenStore.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    order.status = newStatus;
    if (newStatus === 'ready') {
      order.readyTime = new Date().toISOString();
      // Play audio chime
      App.playAudioChime();
      App.showToast(`Order #${order.id} marked READY FOR PICKUP! Student notified.`, 'success');
      // Broadcast specifically that order is ready
      CanteenStore.broadcastChange('order_ready_pickup', { orderId: order.id, token: order.tokenNumber });
    } else if (newStatus === 'collected') {
      order.collectedTime = new Date().toISOString();
      App.showToast(`Order #${order.id} marked as Collected.`, 'info');
    } else if (newStatus === 'preparing') {
      App.showToast(`Order #${order.id} moved to Kitchen Prep.`, 'info');
    }

    CanteenStore.saveOrders(orders);
    App.render();
  },

  assignCounter(orderId, counter) {
    const orders = CanteenStore.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.counter = counter;
      CanteenStore.saveOrders(orders);
      App.showToast(`Assigned to ${counter}`, 'info');
    }
  },

  toggleItemStock(itemId) {
    const items = CanteenStore.getMenu();
    const item = items.find(i => i.id === itemId);
    if (item) {
      item.inStock = !item.inStock;
      CanteenStore.saveMenu(items);
      App.showToast(`${item.name} is now ${item.inStock ? 'IN STOCK' : 'OUT OF STOCK'}`, item.inStock ? 'success' : 'info');
      App.render();
    }
  },

  deleteItem(itemId) {
    if (confirm('Delete this food item from the canteen menu?')) {
      let items = CanteenStore.getMenu();
      items = items.filter(i => i.id !== itemId);
      CanteenStore.saveMenu(items);
      App.showToast('Item deleted', 'info');
      App.render();
    }
  },

  openAddItemModal() {
    this.editingItemId = null;
    this.renderItemModal(null);
  },

  openEditItemModal(itemId) {
    const item = CanteenStore.getMenu().find(i => i.id === itemId);
    this.editingItemId = itemId;
    this.renderItemModal(item);
  },

  renderItemModal(item) {
    const isEdit = !!item;
    const container = document.getElementById('item-modal-container');
    if (!container) return;

    container.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative">
          
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 class="font-extrabold text-slate-900 text-lg">
              ${isEdit ? 'Edit Food Item' : 'Add New Food Item'}
            </h3>
            <button onclick="StaffModule.closeItemModal()" class="text-slate-400 hover:text-slate-600">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <form onsubmit="StaffModule.handleItemSave(event)" class="space-y-4 mt-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Item Name</label>
              <input id="item-name" type="text" required value="${isEdit ? item.name : ''}" placeholder="e.g. Veg Cheese Grilled Sandwich" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"/>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select id="item-category" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white">
                  <option value="snacks" ${isEdit && item.category === 'snacks' ? 'selected' : ''}>Snacks</option>
                  <option value="meals" ${isEdit && item.category === 'meals' ? 'selected' : ''}>Meals</option>
                  <option value="beverages" ${isEdit && item.category === 'beverages' ? 'selected' : ''}>Beverages</option>
                  <option value="desserts" ${isEdit && item.category === 'desserts' ? 'selected' : ''}>Desserts</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Dietary Type</label>
                <select id="item-veg" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white">
                  <option value="true" ${!isEdit || item.isVeg ? 'selected' : ''}>Pure Veg 🟢</option>
                  <option value="false" ${isEdit && !item.isVeg ? 'selected' : ''}>Non-Veg 🔺</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Price (₹)</label>
                <input id="item-price" type="number" required min="5" value="${isEdit ? item.price : '60'}" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"/>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Prep Time (Mins)</label>
                <input id="item-preptime" type="number" required min="1" max="60" value="${isEdit ? item.prepTime : '5'}" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"/>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
              <input id="item-image" type="url" value="${isEdit ? item.image : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}" class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"/>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <textarea id="item-desc" rows="2" placeholder="Delicious ingredients description..." class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200">${isEdit ? (item.description || '') : ''}</textarea>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-slate-100">
              <label class="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input id="item-stock" type="checkbox" ${!isEdit || item.inStock ? 'checked' : ''} class="rounded text-orange-600 focus:ring-orange-500 h-4 w-4"/>
                <span>Available in Stock</span>
              </label>

              <div class="flex items-center gap-2">
                <button type="button" onclick="StaffModule.closeItemModal()" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs">
                  Cancel
                </button>
                <button type="submit" class="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md">
                  ${isEdit ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    `;

    lucide.createIcons();
  },

  closeItemModal() {
    const container = document.getElementById('item-modal-container');
    if (container) container.innerHTML = '';
  },

  handleItemSave(e) {
    e.preventDefault();
    const name = document.getElementById('item-name').value.trim();
    const category = document.getElementById('item-category').value;
    const isVeg = document.getElementById('item-veg').value === 'true';
    const price = parseFloat(document.getElementById('item-price').value) || 50;
    const prepTime = parseInt(document.getElementById('item-preptime').value, 10) || 5;
    const image = document.getElementById('item-image').value.trim();
    const description = document.getElementById('item-desc').value.trim();
    const inStock = document.getElementById('item-stock').checked;

    let items = CanteenStore.getMenu();

    if (this.editingItemId) {
      const idx = items.findIndex(i => i.id === this.editingItemId);
      if (idx !== -1) {
        items[idx] = {
          ...items[idx],
          name, category, isVeg, price, prepTime, image, description, inStock
        };
      }
      App.showToast(`Updated ${name}`, 'success');
    } else {
      const newItem = {
        id: 'item-' + Date.now(),
        name, category, isVeg, price, prepTime, image, description, inStock,
        bestseller: false,
        calories: 300
      };
      items.unshift(newItem);
      App.showToast(`Added ${name} to canteen menu!`, 'success');
    }

    CanteenStore.saveMenu(items);
    this.closeItemModal();
    App.render();
  },

  toggleRushHour() {
    const settings = CanteenStore.getSettings();
    settings.rushHour = !settings.rushHour;
    CanteenStore.saveSettings(settings);
    App.showToast(settings.rushHour ? 'Rush Hour mode ENABLED: +3.5 mins added per queue item' : 'Normal queue flow restored', 'info');
    App.render();
  },

  toggleSound() {
    const settings = CanteenStore.getSettings();
    settings.soundEnabled = settings.soundEnabled === false ? true : false;
    CanteenStore.saveSettings(settings);
    App.showToast(`Sound notifications ${settings.soundEnabled ? 'ENABLED' : 'MUTED'}`, 'info');
    App.render();
  },

  loginAs(staffId) {
    localStorage.setItem(CanteenStore.KEYS.ACTIVE_STAFF_ID, staffId);
    const staff = CanteenStore.getCurrentStaff();
    App.showToast(`Logged in as ${staff.name}`, 'success');
    App.navigate('staff-dashboard');
  },

  handleAuthSubmit(e) {
    e.preventDefault();
    App.showToast('Staff authenticated successfully', 'success');
    App.navigate('staff-dashboard');
  }
};
