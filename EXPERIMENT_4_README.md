# ShopEase — Experiment 4 Documentation

## 📌 Assessment Compliance Checklist

### ✅ UI & Design
- [x] Consistent design maintained from Experiment 3
- [x] Clean, modern layout with luxury dark/gold theme
- [x] Proper spacing, typography (Playfair Display + DM Sans), and colors
- [x] Fully responsive design (mobile + desktop breakpoints)

### ✅ Functionality Requirements

#### 1. React Router (3+ Pages) ✓
**4 Total Pages:**
- `/` — Home page (hero, categories, trending products)
- `/products` — Products listing with filters
- `/cart` — Shopping cart with checkout
- `/analytics` — **NEW: Dashboard with cart analytics** ⭐

**Implementation:** `src/App.jsx` lines 12-17

#### 2. useContext (Global State) ✓
**Context Provider:** `CartProvider` in `src/context/CartContext.jsx`

**Wraps entire app:** `src/App.jsx` line 11

**Used in 5+ components:**
- `src/components/Navbar.jsx` (line 6) — Shows cart count badge
- `src/components/ProductCard.jsx` (line 3) — Add to cart functionality
- `src/pages/Home.jsx` (line 10) — Featured product actions
- `src/pages/Cart.jsx` (line 3) — Full cart management
- `src/pages/Analytics.jsx` (line 4) — **NEW: Analytics dashboard** ⭐

**Global state stored:**
- `cartItems` — Array of products in cart with quantities
- `cartCount` — Total number of items (memoized)
- `cartTotal` — Total price (memoized)
- `cartAnalytics` — Computed stats (memoized)
- `toasts` — Notification system

#### 3. useReducer (Structured State) ✓
**Reducer Function:** `cartReducer` in `src/context/CartContext.jsx` lines 8-70

**7 Actions Implemented:**
1. `ADD_TO_CART` — Add product or increment quantity
2. `REMOVE_FROM_CART` — Remove product from cart
3. `UPDATE_QUANTITY` — Change product quantity
4. `CLEAR_CART` — Empty entire cart
5. `ADD_TOAST` — Show notification
6. `REMOVE_TOAST` — Dismiss notification
7. `SET_TOAST_EXITING` — Animate toast exit

**Example Usage:**
```javascript
dispatch({ type: "ADD_TO_CART", payload: product });
dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
dispatch({ type: "CLEAR_CART" });
```

#### 4. useMemo (Performance Optimization) ✓

**Cart Calculations (CartContext.jsx lines 120-157):**
```javascript
// Total items count — recalculates only when cartItems changes
const cartCount = useMemo(
  () => state.cartItems.reduce((sum, item) => sum + item.quantity, 0),
  [state.cartItems]
);

// Total price — recalculates only when cartItems changes
const cartTotal = useMemo(
  () => state.cartItems.reduce((sum, item) => sum + item.rawPrice * item.quantity, 0),
  [state.cartItems]
);

// Advanced analytics — multiple derived calculations memoized
const cartAnalytics = useMemo(() => {
  const totalItems = state.cartItems.length;
  const totalQuantity = cartCount;
  const avgItemPrice = totalItems > 0 ? cartTotal / totalQuantity : 0;
  const mostExpensiveItem = state.cartItems.reduce(...);
  return { totalItems, totalQuantity, totalValue: cartTotal, avgItemPrice, mostExpensiveItem };
}, [state.cartItems, cartCount, cartTotal]);
```

**Product Filtering (Products.jsx lines 34-56):**
```javascript
const filtered = useMemo(() => {
  let list = [...products];
  // Filter by category
  if (activeCategory !== "All") list = list.filter(...);
  // Filter by search
  if (search.trim()) list = list.filter(...);
  // Sort results
  switch (sort) { ... }
  return list;
}, [activeCategory, search, sort]);
```

**Analytics Page (Analytics.jsx lines 14-69):**
```javascript
// Category breakdown — recalculates only when cart changes
const categoryBreakdown = useMemo(() => { ... }, [cartItems, cartTotal]);

// Popular products ranking — sorts by quantity
const popularProducts = useMemo(() => { ... }, [cartItems]);

// Price range distribution — groups by price tiers
const priceRangeStats = useMemo(() => { ... }, [cartItems]);

// Inventory coverage — compares cart to catalog
const inventoryComparison = useMemo(() => { ... }, [cartItems]);
```

#### 5. New Page (Experiment 4) ✓
**Page:** `src/pages/Analytics.jsx` + `src/pages/Analytics.css`

**Route:** `/analytics`

**Features Demonstrated:**
- Uses `useContext` to access CartContext (line 4)
- Displays data from `useReducer` state (cartItems, cartTotal)
- 4 `useMemo` hooks for performance optimization (lines 14-69)
- Interactive dashboard with KPI cards, charts, and stats
- Real-time updates when cart changes
- Fully responsive design

**Components:**
- KPI Cards — Total items, cart value, unique products, avg price
- Category Breakdown — Bar chart showing category distribution
- Most Expensive Item — Highlighted product card
- Price Range Distribution — Items grouped by price tiers
- Top 5 in Cart — Ranked list of popular items
- Inventory Coverage — Circular progress showing catalog coverage
- Tech Stack Card — Documents all Experiment 4 features

---

## 🎯 Technical Implementation Details

### Context API Architecture
```
App
 └─ CartProvider (useReducer + useMemo)
     ├─ Navbar (useContext)
     ├─ Home (useContext)
     ├─ Products (useContext + useMemo)
     ├─ Cart (useContext)
     └─ Analytics (useContext + 4x useMemo)
```

### State Management Flow
```
User Action → Component calls action function →
Action dispatches to reducer → Reducer returns new state →
Memoized values recalculate if dependencies changed →
Components re-render with updated data
```

### Performance Optimization Strategy
- **useReducer** — Predictable state updates, easier debugging
- **useMemo** — Prevents expensive recalculations on every render
- **useCallback** — Stable function references for action handlers
- **Context** — Global state without prop drilling

---

## 📊 Analytics Page Features

### Real-Time Metrics
- Total items in cart
- Total cart value
- Number of unique products
- Average item price

### Data Visualizations
- Horizontal bar charts with percentage breakdowns
- Circular progress indicator for inventory coverage
- Product cards with images and pricing
- Ranked lists with badges

### Memoization Benefits
Without useMemo:
- 4 complex calculations run on EVERY render
- Sorting, filtering, grouping happens repeatedly
- Poor performance with large datasets

With useMemo:
- Calculations only run when cart changes
- Expensive operations cached between renders
- Smooth, responsive UI even with many items

---

## 🚀 How to Run

```bash
npm install
npm run dev
```

Navigate to http://localhost:5173/

### Testing the Features

1. **useContext** — Add products to cart, see count badge update in navbar
2. **useReducer** — Try all cart actions: add, remove, update quantity, clear
3. **useMemo** — Open Analytics page, add/remove items, watch instant updates
4. **New Page** — Visit `/analytics` to see the dashboard

---

## 📁 File Structure

```
src/
├── context/
│   └── CartContext.jsx       ← useReducer + useMemo + useContext
├── pages/
│   ├── Home.jsx
│   ├── Products.jsx          ← useMemo for filtering
│   ├── Cart.jsx              ← useContext consumer
│   └── Analytics.jsx         ← NEW PAGE with 4x useMemo
├── components/
│   ├── Navbar.jsx            ← useContext consumer
│   ├── ProductCard.jsx       ← useContext consumer
│   ├── Footer.jsx
│   └── Toast.jsx
├── data/
│   └── products.js
├── hooks/
│   └── useInView.js
├── App.jsx                   ← CartProvider wrapper
└── main.jsx
```

---

## ✨ Experiment 4 Highlights

### What Changed from Experiment 3
1. **CartContext upgraded** — useState → useReducer with 7 actions
2. **Performance optimized** — Added useMemo to all expensive calculations
3. **New Analytics page** — Dashboard with real-time cart insights
4. **Enhanced Products page** — Memoized filtering for better performance

### Why This Architecture
- **Scalable** — Easy to add new actions to reducer
- **Maintainable** — Clear separation of state logic and UI
- **Performant** — Memoization prevents unnecessary recalculations
- **Professional** — Follows React best practices and patterns

---

## 🎓 Experiment 4 Learning Outcomes

### useContext
- Created global state accessible across entire component tree
- Eliminated prop drilling through deep hierarchies
- Provided consistent API for state access

### useReducer
- Structured complex state transitions with clear action types
- Made state updates predictable and testable
- Centralized all cart logic in one reducer function

### useMemo
- Identified expensive calculations and cached results
- Improved render performance with dependency tracking
- Optimized derived data computation in Analytics page

### Integration
- Combined all three hooks in CartContext
- Demonstrated real-world usage in Analytics dashboard
- Built production-ready state management system

---

**Submitted by:** [Your Name]  
**Date:** February 2026  
**Project:** ShopEase Ecommerce Platform  
**Experiment:** 4 — Advanced React Hooks
