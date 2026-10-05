# 🎓 CampusBite — Smart Queue Management for College Canteens

> **Skip the long queue. Savor every minute.**  
> A modern, responsive web application designed for campus food courts and college canteens to eliminate crowd bottlenecks, provide real-time queue estimates, and streamline kitchen operations.

---

## 🌟 Key Highlights & Architecture

### 👨‍🎓 1. Student Portal
- **Campus Food Court Landing Page**: Live queue status widget (`~12 min wait`, active kitchen load indicator, quick feature overview).
- **Instant Demo Logins & Registration**: 1-click quick login for demo profiles (e.g. *Aarav Sharma - CS* or *Priya Patel - EC*) plus full registration form with college Roll Number, Email, and Department.
- **Smart Menu Browsing**:
  - Filter by categories: **Snacks & Quick Bites**, **Meals & Combos**, **Beverages & Shakes**, **Desserts & Sweets**.
  - Quick filters: **Pure Veg**, **Bestsellers**, **Fastest Prep Time (⏱️)**, Price sorting, and instant search.
  - Realistic college dishes (Samosas, Crispy Masala Dosa, Paneer Kathi Roll, Chicken Biryani, Masala Chai, Thick Cold Coffee, Warm Brownies).
  - Preparation times (e.g., 3m – 10m), calories, pricing in ₹, and real-time stock availability indicators.
- **Cart & Intelligent Checkout**:
  - Item quantity steppers (`+` / `-`), individual totals, and clear cart option.
  - Special cooking instructions / dietary notes input (`"Extra chutney"`, `"No ice"`).
  - Dining preference selection: **Grab & Go (Takeaway)** vs. **Dine-In (Counter Tray)**.
  - **Dynamic Estimated Pickup Time**:
    $$\text{Estimated Time} = \text{Current Time} + (\text{Active Orders} \times \text{Queue Multiplier}) + \text{Max Dish Prep Time}$$
    Shows exact expected pickup time (e.g. *Ready in ~11 mins at 1:15 PM*).
  - Student Campus Subsidy (10% student discount pre-applied).
  - Instant digital token generation upon placement (e.g., `Token #45`).
- **Live Order Tracker & "My Orders"**:
  - 4-Step Animated Stepper: `Order Placed` ➔ `Preparing in Kitchen` ➔ `Ready for Pickup` ➔ `Collected`.
  - **Pulsing Ready-for-Pickup Banner**: When staff flags an order ready, a high-contrast glowing emerald banner appears with audio chime, counter number (`Counter 1`), and token number.
  - Order history with 1-click **Re-order** button.
- **Student Profile**:
  - Student credentials, roll number, department.
  - **Campus Food Wallet** with quick `+₹100` / `+₹200` top-up simulation.
  - Queue wait time saved statistics (`~140 mins saved from lines!`).

---

### 👨‍🍳 2. Staff Kitchen Portal
- **Staff Authentication**: 1-click demo logins for *Chef Ramesh (Head Chef)* and *Meera (Counter Lead)*.
- **Real-Time Kitchen KPI Dashboard**:
  - **Total Orders Today**
  - **New Orders (Placed)**
  - **In Kitchen (Preparing)**
  - **Ready for Pickup**
  - **Completed Orders**
  - **Today's Revenue (₹)**
  - **Dynamic Queue Wait Time**
- **Incoming Orders Board (Live Kitchen Kanban)**:
  - Tabbed filters: `All Orders`, `New (Placed)`, `Preparing`, `Ready for Pickup`, `Completed`.
  - Search orders by Token Number, Student Name, or Roll Number.
  - **One-Click Status Advancement**:
    1. Click `Accept & Start Preparing` (moves order from Placed to Preparing).
    2. Click `Mark Ready for Pickup` (**instantly notifies student tab, flashes banner, and triggers chime**).
    3. Click `Mark as Collected / Handed Over` (completes order).
  - Counter assignment selector (`Counter 1`, `Counter 2`, `Beverage Counter`).
- **Menu & Inventory Management (CRUD)**:
  - **Instant 1-Click Out-of-Stock Switch**: Toggle dishes in/out of stock. When toggled, the student menu immediately disables the item.
  - **Add New Food Item**: Modal form with Name, Category, Price, Prep Time, Veg/Non-Veg, Image URL, and Description.
  - **Edit Item**: Modify price, prep time, details.
  - **Delete Item**: Remove obsolete dishes.
  - **Reset to Default Menu**: Instant button to restore seed menu items.
- **Queue Load & Rush Hour Simulator**:
  - **Rush Hour Toggle**: Increases queue weight from 2.5 mins to 3.5 mins per order, dynamically updating estimated pickup times shown to students across campus.
  - Audio notification sound toggle.

---

### ⚡ 3. Real-Time Multi-Tab Synchronization
- Built using **Web Audio API** and cross-tab communication (`BroadcastChannel` + `window.storage` event listeners).
- **Try the Two-Window Test**:
  1. Open one browser window in **Student View** (`#my-orders`).
  2. Open a second browser window in **Staff View** (`#staff-orders`).
  3. When staff clicks **"Mark Ready for Pickup"**, the Student window immediately updates with a glowing green banner, a toast notification, and an audio chime—**without refreshing!**

---

## 🚀 Quick Start Guide

### Option 1: Run with Python Server (Recommended)
From PowerShell or terminal in the project directory:

```bash
cd "C:\Users\KOMAL\.gemini\antigravity\scratch\canteen-queue-system"
python server.py
```

Then visit:
👉 **`http://localhost:8000`**

### Option 2: Direct File Open
You can also directly double-click or open `index.html` in any web browser (Chrome, Edge, Firefox, Safari). All features, local persistence, and animations work out-of-the-box.

---

## 🎨 Theme & Design Specs
- **Color Palette**: Warm campus saffron & orange (`#f97316`, `#ea580c`), golden amber (`#f59e0b`), soft warm cream background (`#fcfbf9`), dark slate readable text (`#0f172a`).
- **Typography**: *Plus Jakarta Sans* via Google Fonts.
- **Icons**: Lucide Icons CDN.
- **Responsive**: Fully responsive across mobile smartphones, tablets, and desktop displays. Includes a dedicated mobile bottom navigation bar.
