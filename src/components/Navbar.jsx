import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const { cartCount } = useCart();
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
      <header className={`se-navbar ${scrolled ? "scrolled" : ""}`}>
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
            <Link to="/products?cat=Electronics" className="nav-link">Electronics</Link>
            <Link to="/products?cat=Audio" className="nav-link">Audio</Link>
          </nav>

          {/* Actions */}
          <div className="se-navbar__actions">
            <button
              className="action-btn"
              onClick={() => setSearchOpen(s => !s)}
              aria-label="Search"
            >
              <SearchIcon />
            </button>

            <button className="action-btn" aria-label="Wishlist">
              <HeartIcon />
            </button>

            <Link to="/cart" className="action-btn cart-btn" aria-label="Cart">
              <CartIcon />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount > 9 ? "9+" : cartCount}</span>
              )}
            </Link>

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
      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
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
          <Link to="/products?cat=Electronics" className="mobile-link">
            <span>Electronics</span><ChevronRight />
          </Link>
          <Link to="/products?cat=Audio" className="mobile-link">
            <span>Audio</span><ChevronRight />
          </Link>
          <Link to="/cart" className="mobile-link">
            <span>Cart {cartCount > 0 && `(${cartCount})`}</span><ChevronRight />
          </Link>
        </nav>
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
function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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