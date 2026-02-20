import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { products } from "../data/products";
import "./Analytics.css";

export default function Analytics() {
  const { cartItems, cartCount, cartTotal, cartAnalytics } = useCart();

  // ═══════════════════════════════════════════
  // MEMOIZED CALCULATIONS (useMemo for performance)
  // ═══════════════════════════════════════════

  // Category breakdown - shows which categories are most popular in cart
  const categoryBreakdown = useMemo(() => {
    const breakdown = {};
    cartItems.forEach(item => {
      if (!breakdown[item.category]) {
        breakdown[item.category] = { count: 0, value: 0 };
      }
      breakdown[item.category].count += item.quantity;
      breakdown[item.category].value += item.rawPrice * item.quantity;
    });
    return Object.entries(breakdown).map(([name, data]) => ({
      name,
      ...data,
      percentage: cartTotal > 0 ? (data.value / cartTotal * 100).toFixed(1) : 0,
    }));
  }, [cartItems, cartTotal]);

  // Product popularity - ranks products by quantity in cart
  const popularProducts = useMemo(() => {
    return [...cartItems]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [cartItems]);

  // Price range analysis
  const priceRangeStats = useMemo(() => {
    const ranges = {
      "Under ₹10K": { count: 0, value: 0 },
      "₹10K - ₹50K": { count: 0, value: 0 },
      "₹50K - ₹1L": { count: 0, value: 0 },
      "Above ₹1L": { count: 0, value: 0 },
    };

    cartItems.forEach(item => {
      const price = item.rawPrice;
      const itemValue = price * item.quantity;
      if (price < 10000) {
        ranges["Under ₹10K"].count += item.quantity;
        ranges["Under ₹10K"].value += itemValue;
      } else if (price < 50000) {
        ranges["₹10K - ₹50K"].count += item.quantity;
        ranges["₹10K - ₹50K"].value += itemValue;
      } else if (price < 100000) {
        ranges["₹50K - ₹1L"].count += item.quantity;
        ranges["₹50K - ₹1L"].value += itemValue;
      } else {
        ranges["Above ₹1L"].count += item.quantity;
        ranges["Above ₹1L"].value += itemValue;
      }
    });

    return Object.entries(ranges).map(([range, data]) => ({ range, ...data }));
  }, [cartItems]);

  // Inventory comparison - cart items vs all products
  const inventoryComparison = useMemo(() => {
    const cartProductIds = new Set(cartItems.map(item => item.id));
    const productsInCart = cartProductIds.size;
    const productsAvailable = products.length;
    const coveragePercent = ((productsInCart / productsAvailable) * 100).toFixed(1);

    return {
      productsInCart,
      productsAvailable,
      coveragePercent,
      productsNotInCart: productsAvailable - productsInCart,
    };
  }, [cartItems]);

  return (
    <div className="analytics-page page-enter">
      {/* Header */}
      <div className="analytics-header">
        <div className="analytics-header__inner">
          <div>
            <p className="section-label-sm">Shopping Insights</p>
            <h1>Cart Analytics</h1>
            <p className="analytics-subtitle">
              Real-time insights powered by useMemo, useContext, and useReducer
            </p>
          </div>
          <Link to="/cart" className="btn-primary-se">
            View Cart <Arrow />
          </Link>
        </div>
      </div>

      <div className="analytics-container">
        {cartItems.length === 0 ? (
          <div className="analytics-empty">
            <div className="empty-icon">📊</div>
            <h2>No Data Yet</h2>
            <p>Add products to your cart to see analytics and insights.</p>
            <Link to="/products" className="btn-primary-se">
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-icon">🛒</div>
                <div className="kpi-value">{cartAnalytics.totalQuantity}</div>
                <div className="kpi-label">Total Items</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon">💰</div>
                <div className="kpi-value">₹{(cartTotal / 1000).toFixed(0)}K</div>
                <div className="kpi-label">Cart Value</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon">📦</div>
                <div className="kpi-value">{cartAnalytics.totalItems}</div>
                <div className="kpi-label">Unique Products</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon">📈</div>
                <div className="kpi-value">
                  ₹{(cartAnalytics.avgItemPrice / 1000).toFixed(1)}K
                </div>
                <div className="kpi-label">Avg Item Price</div>
              </div>
            </div>

            {/* Main Content Grid */}
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
                        <div
                          className="bar-fill"
                          style={{
                            width: `${cat.percentage}%`,
                            backgroundColor: `hsl(${i * 60}, 70%, 55%)`,
                          }}
                        />
                      </div>
                      <div className="bar-meta">
                        {cat.count} items · ₹{cat.value.toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Most Expensive Item */}
              <div className="analytics-card highlight-card">
                <h3>Most Expensive Item</h3>
                {cartAnalytics.mostExpensiveItem.name ? (
                  <div className="highlight-product">
                    <img
                      src={cartAnalytics.mostExpensiveItem.image}
                      alt={cartAnalytics.mostExpensiveItem.name}
                    />
                    <div className="highlight-info">
                      <h4>{cartAnalytics.mostExpensiveItem.name}</h4>
                      <p className="highlight-category">
                        {cartAnalytics.mostExpensiveItem.category}
                      </p>
                      <div className="highlight-price">
                        {cartAnalytics.mostExpensiveItem.price}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>No items in cart</p>
                )}
              </div>

              {/* Price Range Distribution */}
              <div className="analytics-card">
                <h3>Price Range Distribution</h3>
                <div className="range-list">
                  {priceRangeStats.map((range, i) => (
                    <div key={i} className="range-item">
                      <div className="range-header">
                        <span className="range-label">{range.range}</span>
                        <span className="range-count">{range.count} items</span>
                      </div>
                      <div className="range-value">
                        ₹{range.value.toLocaleString("en-IN")}
                      </div>
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
                        <div className="popular-meta">
                          {product.quantity}x · {product.price}
                        </div>
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
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="var(--off-white)"
                      strokeWidth="20"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="var(--gold)"
                      strokeWidth="20"
                      strokeDasharray={`${
                        (inventoryComparison.coveragePercent / 100) * 502
                      } 502`}
                      strokeLinecap="round"
                      transform="rotate(-90 100 100)"
                    />
                    <text
                      x="100"
                      y="95"
                      textAnchor="middle"
                      fontSize="32"
                      fontWeight="800"
                      fill="var(--black)"
                    >
                      {inventoryComparison.coveragePercent}%
                    </text>
                    <text
                      x="100"
                      y="115"
                      textAnchor="middle"
                      fontSize="12"
                      fill="var(--mid)"
                    >
                      Coverage
                    </text>
                  </svg>
                </div>
                <div className="coverage-stats">
                  <div className="coverage-stat">
                    <span className="stat-value">
                      {inventoryComparison.productsInCart}
                    </span>
                    <span className="stat-label">In Cart</span>
                  </div>
                  <div className="coverage-stat">
                    <span className="stat-value">
                      {inventoryComparison.productsNotInCart}
                    </span>
                    <span className="stat-label">Not Added</span>
                  </div>
                </div>
              </div>

              {/* Tech Stack Note */}
              <div className="analytics-card tech-card">
                <h3>🧩 Experiment 4 Features</h3>
                <ul className="tech-list">
                  <li>
                    <strong>useContext:</strong> CartContext provides global state
                    across all components
                  </li>
                  <li>
                    <strong>useReducer:</strong> cartReducer manages 7 actions (ADD,
                    REMOVE, UPDATE, CLEAR, etc.)
                  </li>
                  <li>
                    <strong>useMemo:</strong> All analytics are memoized for optimal
                    performance
                  </li>
                  <li>
                    <strong>React Router:</strong> 4 pages (Home, Products, Cart,
                    Analytics)
                  </li>
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
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
