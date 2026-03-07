import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme } from "../context/ThemeContext";
import "./Navbar.css";

export default function Navbar() {
  // ── Redux: cart count via useSelector (replaces useCart cartCount)
  const cartItems = useSelector(state => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // ── Redux: wishlist badge count
  const wishlistCount = useSelector(state => state.wishlist.items.length);

  // ── useContext: theme toggle + user profile from ThemeContext
  const { theme, toggleTheme, user, isDark } = useTheme();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className={`se-navbar ${scrolled ? "scrolled" : ""} ${isDark ? "dark-nav" : ""}`}>
        <div className="se-navbar__inner">
          {/* Logo */}
          <Link to="/" className="se-navbar__logo">
            <span className="logo-icon">◈</span>
            <span className="logo-text">ShopEase</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="se-navbar__links">
            <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>Home</Link>
            <Link to="/products" className={`nav-link ${isActive("/products") ? "active" : ""}`}>Products</Link>
            <Link to="/analytics" className={`nav-link ${isActive("/analytics") ? "active" : ""}`}>Analytics</Link>
            {/* NEW link — Wishlist page */}
            <Link to="/wishlist" className={`nav-link ${isActive("/wishlist") ? "active" : ""}`}>
              Wishlist
              {wishlistCount > 0 && (
                <span className="nav-badge">{wishlistCount}</span>
              )}
            </Link>
            <Link to="/products?cat=Electronics" className="nav-link">Electronics</Link>
          </nav>

          {/* Actions */}
          <div className="se-navbar__actions">
            {/* Theme Toggle — reads/sets ThemeContext */}
            <button
              className="action-btn theme-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              title={isDark ? "Light Mode" : "Dark Mode"}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>

            <button
              className="action-btn"
              onClick={() => setSearchOpen(s => !s)}
              aria-label="Search"
            >
              <SearchIcon />
            </button>

            {/* Wishlist — Redux useSelector */}
            <Link to="/wishlist" className="action-btn" aria-label="Wishlist">
              <HeartIcon filled={wishlistCount > 0} />
              {wishlistCount > 0 && (
                <span className="cart-badge">{wishlistCount > 9 ? "9+" : wishlistCount}</span>
              )}
            </Link>

            {/* Cart — Redux useSelector */}
            <Link to="/cart" className="action-btn cart-btn" aria-label="Cart">
              <CartIcon />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount > 9 ? "9+" : cartCount}</span>
              )}
            </Link>

            {/* User Avatar — useContext (ThemeContext user) */}
            <div className="user-avatar" title={`${user.name} · ${user.tier}`}>
              {user.avatar}
            </div>

            <button
              className="mobile-toggle"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Menu"
            >
              <span className={`hamburger ${mobileOpen ? "open" : ""}`}>
                <span /><span /><span />
              </span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className={`search-bar ${searchOpen ? "open" : ""}`}>
          <div className="search-bar__inner">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              autoFocus={searchOpen}
            />
            <kbd>ESC</kbd>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? "open" : ""} ${isDark ? "dark-mobile" : ""}`}>
        <nav>
          <Link to="/" className={`mobile-link ${isActive("/") ? "active" : ""}`}>
            <span>Home</span><ChevronRight />
          </Link>
          <Link to="/products" className={`mobile-link ${isActive("/products") ? "active" : ""}`}>
            <span>All Products</span><ChevronRight />
          </Link>
          <Link to="/analytics" className={`mobile-link ${isActive("/analytics") ? "active" : ""}`}>
            <span>Analytics</span><ChevronRight />
          </Link>
          <Link to="/wishlist" className={`mobile-link ${isActive("/wishlist") ? "active" : ""}`}>
            <span>Wishlist {wishlistCount > 0 && `(${wishlistCount})`}</span><ChevronRight />
          </Link>
          <Link to="/cart" className="mobile-link">
            <span>Cart {cartCount > 0 && `(${cartCount})`}</span><ChevronRight />
          </Link>
          <button className="mobile-link mobile-theme-toggle" onClick={toggleTheme}>
            <span>{isDark ? "☀ Light Mode" : "☾ Dark Mode"}</span><ChevronRight />
          </button>
        </nav>
        {/* User info from ThemeContext */}
        <div className="mobile-user">
          <div className="mobile-user__avatar">{user.avatar}</div>
          <div>
            <div className="mobile-user__name">{user.name}</div>
            <div className="mobile-user__tier">{user.tier}</div>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}
function HeartIcon({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}
function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}