import { useState } from "react";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";

export default function ProductCard({ product, delay = 0 }) {
  const { addToCart } = useCart();
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discount = product.originalPrice
    ? Math.round(
        ((parseInt(product.originalPrice.replace(/[^0-9]/g, "")) -
          parseInt(product.price.replace(/[^0-9]/g, ""))) /
          parseInt(product.originalPrice.replace(/[^0-9]/g, ""))) *
          100
      )
    : null;

  return (
    <div
      className="product-card card-hover"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Zone */}
      <div className="product-card__image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className={`product-card__img primary ${hovered ? "hidden" : "visible"}`}
          loading="lazy"
        />
        <img
          src={product.hoverImage}
          alt={`${product.name} alternate`}
          className={`product-card__img secondary ${hovered ? "visible" : "hidden"}`}
          loading="lazy"
        />

        {/* Badges */}
        <div className="product-card__badges">
          {product.badge && (
            <span className="badge-pill badge-dark">{product.badge}</span>
          )}
          {discount && (
            <span className="badge-pill badge-accent">-{discount}%</span>
          )}
        </div>

        {/* Quick Actions */}
        <div className={`product-card__quick-actions ${hovered ? "visible" : ""}`}>
          <button className="quick-btn" aria-label="Wishlist">
            <HeartIcon />
          </button>
          <button className="quick-btn" aria-label="Quick View">
            <EyeIcon />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="product-card__info">
        <div className="product-card__meta">
          <span className="tag-se">{product.category}</span>
          <div className="product-card__rating">
            <StarIcon />
            <span>{product.rating}</span>
            <span className="review-count">({product.reviews.toLocaleString()})</span>
          </div>
        </div>

        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__desc">{product.description}</p>

        <div className="product-card__features">
          {product.features.slice(0, 2).map((f, i) => (
            <span key={i} className="feature-chip">✓ {f}</span>
          ))}
        </div>

        <div className="product-card__footer">
          <div className="product-card__pricing">
            <span className="price-current">{product.price}</span>
            {product.originalPrice && (
              <span className="price-original">{product.originalPrice}</span>
            )}
          </div>
          <button
            className={`add-btn ${added ? "added" : ""}`}
            onClick={handleAdd}
          >
            {added ? (
              <>
                <CheckIcon />
                <span>Added</span>
              </>
            ) : (
              <>
                <CartPlusIcon />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function HeartIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
}
function EyeIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function StarIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
}
function CartPlusIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/><line x1="19" y1="2" x2="19" y2="8"/><line x1="16" y1="5" x2="22" y2="5"/></svg>;
}
function CheckIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;
}