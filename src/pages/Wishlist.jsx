import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist, clearWishlist } from "../redux/slices/wishlistSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { useTheme } from "../context/ThemeContext";
import { products } from "../data/products";
import "./Wishlist.css";

// ═══════════════════════════════════════════════════════
// EXPERIMENT 5 — WISHLIST PAGE
//  ✅ Redux Toolkit  → useDispatch + useSelector
//  ✅ useContext      → useTheme() (ThemeContext)
//  ✅ useMemo (×4)   → summaryStats, categoryBreakdown,
//                       filteredItems, availableCategories
//  ✅ React Router   → /wishlist route in App.jsx
// ═══════════════════════════════════════════════════════

export default function Wishlist() {
  // ── Redux ───────────────────────────────────────────
  const dispatch      = useDispatch();
  const wishlistItems = useSelector(state => state.wishlist.items);
  const cartItems     = useSelector(state => state.cart.items);

  // ── useContext ──────────────────────────────────────
  const { isDark, user, theme } = useTheme();

  // ── Local UI state ──────────────────────────────────
  const [search,    setSearch]    = useState("");
  const [sortBy,    setSortBy]    = useState("added");
  const [filterCat, setFilterCat] = useState("All");

  // ── Redux action helpers ────────────────────────────
  const handleRemove     = (item)  => dispatch(toggleWishlist(item));
  const handleClearAll   = ()      => dispatch(clearWishlist());
  const handleMoveToCart = (item)  => {
    dispatch(addToCart(item));
    dispatch(toggleWishlist(item));
  };

  // ══════════════════════════════════════════════════
  // useMemo 1 — Summary statistics
  // Depends on: wishlistItems, cartItems
  // ══════════════════════════════════════════════════
  const summaryStats = useMemo(() => {
    const totalValue     = wishlistItems.reduce((sum, i) => sum + i.rawPrice, 0);
    const avgPrice       = wishlistItems.length > 0 ? totalValue / wishlistItems.length : 0;
    const alreadyInCart  = wishlistItems.filter(i => cartItems.some(ci => ci.id === i.id)).length;
    const savings        = wishlistItems.reduce((sum, item) => {
      if (!item.originalPrice) return sum;
      const orig = parseInt(item.originalPrice.replace(/[^0-9]/g, ""), 10);
      return sum + (orig - item.rawPrice);
    }, 0);
    return { totalValue, avgPrice, alreadyInCart, savings, count: wishlistItems.length };
  }, [wishlistItems, cartItems]);

  // ══════════════════════════════════════════════════
  // useMemo 2 — Category breakdown for sidebar chart
  // Depends on: wishlistItems
  // ══════════════════════════════════════════════════
  const categoryBreakdown = useMemo(() => {
    const map = {};
    wishlistItems.forEach(item => { map[item.category] = (map[item.category] || 0) + 1; });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count, pct: ((count / wishlistItems.length) * 100).toFixed(0) }))
      .sort((a, b) => b.count - a.count);
  }, [wishlistItems]);

  // ══════════════════════════════════════════════════
  // useMemo 3 — Filtered + sorted list
  // Depends on: wishlistItems, search, sortBy, filterCat
  // ══════════════════════════════════════════════════
  const filteredItems = useMemo(() => {
    let list = [...wishlistItems];
    if (filterCat !== "All") list = list.filter(i => i.category === filterCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(i => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
    }
    switch (sortBy) {
      case "price-asc":  return list.sort((a, b) => a.rawPrice - b.rawPrice);
      case "price-desc": return list.sort((a, b) => b.rawPrice - a.rawPrice);
      case "rating":     return list.sort((a, b) => b.rating - a.rating);
      case "name":       return list.sort((a, b) => a.name.localeCompare(b.name));
      default:           return list;
    }
  }, [wishlistItems, search, sortBy, filterCat]);

  // ══════════════════════════════════════════════════
  // useMemo 4 — Available categories from wishlist
  // Depends on: wishlistItems
  // ══════════════════════════════════════════════════
  const availableCategories = useMemo(() => {
    const cats = new Set(wishlistItems.map(i => i.category));
    return ["All", ...Array.from(cats)];
  }, [wishlistItems]);

  // Suggested products (not in wishlist)
  const suggestions = useMemo(() => {
    const ids = new Set(wishlistItems.map(i => i.id));
    return products.filter(p => !ids.has(p.id)).slice(0, 4);
  }, [wishlistItems]);

  return (
    <div className={`wishlist-page page-enter${isDark ? " wl-dark" : ""}`}>

      {/* ── Page Header ─────────────────────────── */}
      <div className="wl-header">
        <div className="wl-header__inner">
          <div>
            <p className="section-label-sm">Your Collection</p>
            <h1>
              Wishlist
              {summaryStats.count > 0 && (
                <span className="wl-count-badge">{summaryStats.count}</span>
              )}
            </h1>
            {/* useContext: user name from ThemeContext */}
            <p className="wl-subtitle">{user.name}'s saved items · {user.tier}</p>
          </div>
          <div className="wl-header__actions">
            {wishlistItems.length > 0 && (
              <button className="btn-ghost-se" onClick={handleClearAll}>Clear All</button>
            )}
            <Link to="/products" className="btn-primary-se">Add More <Arrow /></Link>
          </div>
        </div>
      </div>

      <div className="wl-body">
        {wishlistItems.length === 0 ? (
          <EmptyState suggestions={suggestions} dispatch={dispatch} toggle={toggleWishlist} isDark={isDark} />
        ) : (
          <div className="wl-layout">

            {/* ── Left: Item Grid ─────────────────── */}
            <div className="wl-main">
              {/* Controls */}
              <div className="wl-controls">
                <div className="wl-search">
                  <SearchIcon />
                  <input
                    type="text"
                    placeholder="Search your wishlist..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <select className="wl-select" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                  {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="wl-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="added">Recently Added</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="rating">Best Rated</option>
                  <option value="name">A → Z</option>
                </select>
              </div>

              {(search || filterCat !== "All") && (
                <p className="wl-results-info">
                  Showing <strong>{filteredItems.length}</strong> of {wishlistItems.length} items
                  {filterCat !== "All" && ` in ${filterCat}`}
                  {search && ` matching "${search}"`}
                </p>
              )}

              {/* Cards */}
              <div className="wl-grid">
                {filteredItems.map((item, i) => {
                  const inCart = cartItems.some(ci => ci.id === item.id);
                  return (
                    <WishlistCard
                      key={item.id}
                      item={item}
                      inCart={inCart}
                      delay={i * 60}
                      isDark={isDark}
                      onRemove={() => handleRemove(item)}
                      onMoveToCart={() => handleMoveToCart(item)}
                    />
                  );
                })}
              </div>

              {filteredItems.length === 0 && (
                <div className="wl-no-results">
                  <span>🔍</span>
                  <p>No items match your search.</p>
                  <button className="btn-ghost-se" onClick={() => { setSearch(""); setFilterCat("All"); }}>
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* ── Right: Sidebar ──────────────────── */}
            <div className="wl-sidebar">

              {/* Stats — useMemo summaryStats */}
              <div className="wl-stats-card">
                <h3>📊 Wishlist Summary</h3>
                <p className="wl-note">Powered by useMemo</p>
                <div className="wl-stats-grid">
                  <div className="wl-stat"><span className="wl-stat__val">{summaryStats.count}</span><span className="wl-stat__lbl">Saved Items</span></div>
                  <div className="wl-stat"><span className="wl-stat__val">₹{(summaryStats.totalValue / 1000).toFixed(0)}K</span><span className="wl-stat__lbl">Total Value</span></div>
                  <div className="wl-stat"><span className="wl-stat__val">₹{(summaryStats.avgPrice / 1000).toFixed(1)}K</span><span className="wl-stat__lbl">Avg Price</span></div>
                  <div className="wl-stat"><span className="wl-stat__val wl-stat__val--green">₹{(summaryStats.savings / 1000).toFixed(0)}K</span><span className="wl-stat__lbl">Potential Savings</span></div>
                </div>
                {summaryStats.alreadyInCart > 0 && (
                  <div className="wl-cart-notice">
                    🛒 {summaryStats.alreadyInCart} item{summaryStats.alreadyInCart > 1 ? "s are" : " is"} already in your cart
                  </div>
                )}
              </div>

              {/* Category Breakdown — useMemo categoryBreakdown */}
              {categoryBreakdown.length > 0 && (
                <div className="wl-cat-card">
                  <h3>Category Breakdown</h3>
                  {categoryBreakdown.map((cat, i) => (
                    <div key={cat.name} className="wl-cat-row">
                      <div className="wl-cat-row__info">
                        <span className="wl-cat-dot" style={{ background: `hsl(${i * 55 + 30}, 65%, 55%)` }} />
                        <span className="wl-cat-name">{cat.name}</span>
                        <span className="wl-cat-count">{cat.count}</span>
                      </div>
                      <div className="wl-cat-bar">
                        <div className="wl-cat-bar__fill" style={{ width: `${cat.pct}%`, background: `hsl(${i * 55 + 30}, 65%, 55%)` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* User Profile — useContext (ThemeContext) */}
              <div className="wl-user-card">
                <h3>👤 Your Profile</h3>
                <p className="wl-note">From useContext (ThemeContext)</p>
                <div className="wl-user-info">
                  <div className="wl-user-avatar">{user.avatar}</div>
                  <div>
                    <div className="wl-user-name">{user.name}</div>
                    <div className="wl-user-tier">{user.tier}</div>
                  </div>
                </div>
                <div className="wl-user-stats">
                  <div className="wl-user-stat"><span className="wl-user-stat__val">{user.totalOrders}</span><span className="wl-user-stat__lbl">Orders</span></div>
                  <div className="wl-user-stat"><span className="wl-user-stat__val">₹{(user.savedAmount / 1000).toFixed(0)}K</span><span className="wl-user-stat__lbl">Saved</span></div>
                  <div className="wl-user-stat"><span className="wl-user-stat__val">{user.joinDate}</span><span className="wl-user-stat__lbl">Member Since</span></div>
                </div>
              </div>

              {/* Tech Badge */}
              <div className="wl-tech-card">
                <h4>🧩 Experiment 5 Features</h4>
                <ul className="wl-tech-list">
                  <li><strong>Redux Toolkit:</strong> wishlistSlice (toggleWishlist, clearWishlist) + cartSlice (addToCart) via useDispatch &amp; useSelector</li>
                  <li><strong>useContext:</strong> ThemeContext provides theme, user, isDark in Navbar + Wishlist + Analytics</li>
                  <li><strong>useMemo ×4:</strong> summaryStats, categoryBreakdown, filteredItems, availableCategories</li>
                  <li><strong>React Router:</strong> /wishlist is the 5th route</li>
                </ul>
                <div className="wl-theme-badge">
                  Current theme: <strong>{theme}</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── WishlistCard sub-component ────────────────────────── */
function WishlistCard({ item, inCart, delay, onRemove, onMoveToCart, isDark }) {
  return (
    <div className={`wl-card${isDark ? " wl-card--dark" : ""}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="wl-card__img">
        <img src={item.image} alt={item.name} loading="lazy" />
        {item.badge && <span className="wl-card__badge">{item.badge}</span>}
        <button className="wl-card__remove" onClick={onRemove} aria-label="Remove">
          <TrashIcon />
        </button>
      </div>
      <div className="wl-card__body">
        <span className="tag-se">{item.category}</span>
        <h3 className="wl-card__name">{item.name}</h3>
        <p className="wl-card__desc">{item.description}</p>
        <div className="wl-card__rating">
          <StarIcon /><span>{item.rating}</span>
          <span className="wl-card__reviews">({item.reviews?.toLocaleString()})</span>
        </div>
        <div className="wl-card__pricing">
          <span className="wl-card__price">{item.price}</span>
          {item.originalPrice && <span className="wl-card__orig">{item.originalPrice}</span>}
        </div>
        <button
          className={`wl-card__cart-btn${inCart ? " in-cart" : ""}`}
          onClick={onMoveToCart}
          disabled={inCart}
        >
          {inCart ? "✓ In Cart" : "Move to Cart"}
        </button>
      </div>
    </div>
  );
}

/* ── Empty State ─────────────────────────────────────────── */
function EmptyState({ suggestions, dispatch, toggle, isDark }) {
  return (
    <div className={`wl-empty${isDark ? " wl-empty--dark" : ""}`}>
      <div className="wl-empty__icon">🤍</div>
      <h2>Your wishlist is empty</h2>
      <p>Save products you love and come back to them anytime.</p>
      <Link to="/products" className="btn-primary-se">Browse Products <Arrow /></Link>
      {suggestions.length > 0 && (
        <div className="wl-suggestions">
          <h3>You might like these</h3>
          <div className="wl-suggestions__grid">
            {suggestions.map(product => (
              <div key={product.id} className="wl-suggest-card">
                <img src={product.image} alt={product.name} />
                <div className="wl-suggest-info">
                  <p className="wl-suggest-name">{product.name}</p>
                  <p className="wl-suggest-price">{product.price}</p>
                </div>
                <button className="wl-suggest-add" onClick={() => dispatch(toggle(product))} aria-label="Add to wishlist">
                  <HeartIcon />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Icons ────────────────────────────────────────────────── */
function Arrow()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>; }
function SearchIcon(){ return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }
function TrashIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>; }
function StarIcon()  { return <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>; }
function HeartIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>; }