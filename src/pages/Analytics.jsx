import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme } from "../context/ThemeContext";
import { products } from "../data/products";
import "./Analytics.css";

export default function Analytics() {
  // ── Redux: read cart from Redux store (replaces useCart)
  const cartItems = useSelector(state => state.cart.items);

  // ── useMemo: derive totals from Redux state
  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.rawPrice * item.quantity, 0),
    [cartItems]
  );
  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  // ── useContext: theme + user from ThemeContext (2nd component using context)
  const { isDark, user } = useTheme();

  // ── useMemo: cart analytics summary
  const cartAnalytics = useMemo(() => {
    const totalItems    = cartItems.length;
    const totalQuantity = cartCount;
    const avgItemPrice  = totalItems > 0 ? cartTotal / totalQuantity : 0;
    const mostExpensiveItem = cartItems.reduce(
      (max, item) => (item.rawPrice > (max.rawPrice || 0) ? item : max),
      cartItems[0] || { rawPrice: 0 }
    );
    return { totalItems, totalQuantity, totalValue: cartTotal, avgItemPrice, mostExpensiveItem };
  }, [cartItems, cartCount, cartTotal]);

  // ── useMemo: category breakdown
  const categoryBreakdown = useMemo(() => {
    const breakdown = {};
    cartItems.forEach(item => {
      if (!breakdown[item.category]) breakdown[item.category] = { count: 0, value: 0 };
      breakdown[item.category].count += item.quantity;
      breakdown[item.category].value += item.rawPrice * item.quantity;
    });
    return Object.entries(breakdown).map(([name, data]) => ({
      name, ...data,
      percentage: cartTotal > 0 ? (data.value / cartTotal * 100).toFixed(1) : 0,
    }));
  }, [cartItems, cartTotal]);

  // ── useMemo: popularity sort
  const popularProducts = useMemo(() => (
    [...cartItems].sort((a, b) => b.quantity - a.quantity).slice(0, 5)
  ), [cartItems]);

  // ── useMemo: price range stats
  const priceRangeStats = useMemo(() => {
    const ranges = {
      "Under ₹10K":   { count: 0, value: 0 },
      "₹10K - ₹50K":  { count: 0, value: 0 },
      "₹50K - ₹1L":   { count: 0, value: 0 },
      "Above ₹1L":    { count: 0, value: 0 },
    };
    cartItems.forEach(item => {
      const p = item.rawPrice, v = p * item.quantity;
      if      (p < 10000)  { ranges["Under ₹10K"].count  += item.quantity; ranges["Under ₹10K"].value  += v; }
      else if (p < 50000)  { ranges["₹10K - ₹50K"].count += item.quantity; ranges["₹10K - ₹50K"].value += v; }
      else if (p < 100000) { ranges["₹50K - ₹1L"].count  += item.quantity; ranges["₹50K - ₹1L"].value  += v; }
      else                 { ranges["Above ₹1L"].count    += item.quantity; ranges["Above ₹1L"].value    += v; }
    });
    return Object.entries(ranges).map(([range, data]) => ({ range, ...data }));
  }, [cartItems]);

  // ── useMemo: inventory coverage
  const inventoryComparison = useMemo(() => {
    const cartProductIds  = new Set(cartItems.map(item => item.id));
    const productsInCart  = cartProductIds.size;
    const productsAvailable = products.length;
    const coveragePercent = ((productsInCart / productsAvailable) * 100).toFixed(1);
    return { productsInCart, productsAvailable, coveragePercent, productsNotInCart: productsAvailable - productsInCart };
  }, [cartItems]);

  return (
    <div className={`analytics-page page-enter${isDark ? " analytics-dark" : ""}`}>
      <div className="analytics-header">
        <div className="analytics-header__inner">
          <div>
            <p className="section-label-sm">Shopping Insights</p>
            <h1>Cart Analytics</h1>
            <p className="analytics-subtitle">
              Real-time insights · Redux Toolkit + useContext + useMemo
            </p>
          </div>
          <Link to="/cart" className="btn-primary-se">View Cart <Arrow /></Link>
        </div>
      </div>

      <div className="analytics-container">
        {cartItems.length === 0 ? (
          <div className="analytics-empty">
            <div className="empty-icon">📊</div>
            <h2>No Data Yet</h2>
            <p>Add products to your cart to see analytics and insights.</p>
            <Link to="/products" className="btn-primary-se">Browse Products</Link>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="kpi-grid">
              <div className="kpi-card"><div className="kpi-icon">🛒</div><div className="kpi-value">{cartAnalytics.totalQuantity}</div><div className="kpi-label">Total Items</div></div>
              <div className="kpi-card"><div className="kpi-icon">💰</div><div className="kpi-value">₹{(cartTotal / 1000).toFixed(0)}K</div><div className="kpi-label">Cart Value</div></div>
              <div className="kpi-card"><div className="kpi-icon">📦</div><div className="kpi-value">{cartAnalytics.totalItems}</div><div className="kpi-label">Unique Products</div></div>
              <div className="kpi-card"><div className="kpi-icon">📈</div><div className="kpi-value">₹{(cartAnalytics.avgItemPrice / 1000).toFixed(1)}K</div><div className="kpi-label">Avg Item Price</div></div>
            </div>

            <div className="analytics-grid">
              {/* Category Breakdown */}
              <div className="analytics-card">
                <h3>Category Breakdown</h3>
                <div className="chart-bars">
                  {categoryBreakdown.map((cat, i) => (
                    <div key={i} className="chart-bar-item">
                      <div className="bar-info">
                        <span className="bar-label">{cat.name}</span>
                        <span className="bar-value">{cat.percentage}%</span>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${cat.percentage}%`, backgroundColor: `hsl(${i * 60}, 70%, 55%)` }} />
                      </div>
                      <div className="bar-meta">{cat.count} items · ₹{cat.value.toLocaleString("en-IN")}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Most Expensive */}
              <div className="analytics-card highlight-card">
                <h3>Most Expensive Item</h3>
                {cartAnalytics.mostExpensiveItem.name ? (
                  <div className="highlight-product">
                    <img src={cartAnalytics.mostExpensiveItem.image} alt={cartAnalytics.mostExpensiveItem.name} />
                    <div className="highlight-info">
                      <h4>{cartAnalytics.mostExpensiveItem.name}</h4>
                      <p className="highlight-category">{cartAnalytics.mostExpensiveItem.category}</p>
                      <div className="highlight-price">{cartAnalytics.mostExpensiveItem.price}</div>
                    </div>
                  </div>
                ) : <p>No items in cart</p>}
              </div>

              {/* Price Range */}
              <div className="analytics-card">
                <h3>Price Range Distribution</h3>
                <div className="range-list">
                  {priceRangeStats.map((range, i) => (
                    <div key={i} className="range-item">
                      <div className="range-header">
                        <span className="range-label">{range.range}</span>
                        <span className="range-count">{range.count} items</span>
                      </div>
                      <div className="range-value">₹{range.value.toLocaleString("en-IN")}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Products */}
              <div className="analytics-card">
                <h3>Top 5 in Cart</h3>
                <div className="popular-list">
                  {popularProducts.map((product, i) => (
                    <div key={product.id} className="popular-item">
                      <span className="popular-rank">#{i + 1}</span>
                      <img src={product.image} alt={product.name} />
                      <div className="popular-info">
                        <div className="popular-name">{product.name}</div>
                        <div className="popular-meta">{product.quantity}x · {product.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inventory Coverage */}
              <div className="analytics-card coverage-card">
                <h3>Inventory Coverage</h3>
                <div className="coverage-visual">
                  <svg viewBox="0 0 200 200" className="coverage-circle">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="var(--off-white)" strokeWidth="20" />
                    <circle cx="100" cy="100" r="80" fill="none" stroke="var(--gold)" strokeWidth="20"
                      strokeDasharray={`${(inventoryComparison.coveragePercent / 100) * 502} 502`}
                      strokeLinecap="round" transform="rotate(-90 100 100)" />
                    <text x="100" y="95" textAnchor="middle" fontSize="32" fontWeight="800" fill="var(--black)">{inventoryComparison.coveragePercent}%</text>
                    <text x="100" y="115" textAnchor="middle" fontSize="12" fill="var(--mid)">Coverage</text>
                  </svg>
                </div>
                <div className="coverage-stats">
                  <div className="coverage-stat"><span className="stat-value">{inventoryComparison.productsInCart}</span><span className="stat-label">In Cart</span></div>
                  <div className="coverage-stat"><span className="stat-value">{inventoryComparison.productsNotInCart}</span><span className="stat-label">Not Added</span></div>
                </div>
              </div>

              {/* Tech Stack Note — updated for Exp 5 */}
              <div className="analytics-card tech-card">
                <h3>🧩 Experiment 5 Upgrades</h3>
                <ul className="tech-list">
                  <li><strong>Redux Toolkit:</strong> useSelector reads cart from Redux store. useDispatch used in Cart, ProductCard, Wishlist.</li>
                  <li><strong>useContext (ThemeContext):</strong> theme + user profile shared across Navbar, Analytics, Wishlist.</li>
                  <li><strong>useMemo (×6 here):</strong> cartTotal, cartCount, cartAnalytics, categoryBreakdown, popularProducts, priceRangeStats — all memoized.</li>
                  <li><strong>React Router:</strong> 5 pages (Home, Products, Cart, Analytics, <strong>Wishlist ✨</strong>).</li>
                  <li><strong>Logged in as:</strong> {user?.name} · {user?.tier}</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Arrow() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
}