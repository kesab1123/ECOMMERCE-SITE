import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../redux/slices/cartSlice";
import { useCart } from "../context/CartContext";
import "./Cart.css";

export default function Cart() {
  // ── Redux: read cart items via useSelector
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);

  // ── useMemo: derived totals — recomputes only when cartItems changes
  const { cartTotal, cartCount } = useMemo(() => {
    const total = cartItems.reduce((sum, item) => sum + item.rawPrice * item.quantity, 0);
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return { cartTotal: total, cartCount: count };
  }, [cartItems]);

  // ── Redux dispatch actions
  const handleRemove = (id) => dispatch(removeFromCart(id));
  const handleQty    = (id, qty) => { if (qty > 0) dispatch(updateQuantity({ id, quantity: qty })); };
  const handleClear  = () => dispatch(clearCart());

  // useCart still used for toast notifications only
  const { addToCart } = useCart();

  const gst       = Math.round(cartTotal * 0.18);
  const delivery  = cartTotal >= 5000 ? 0 : 199;
  const grandTotal = cartTotal + gst + delivery;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page page-enter">
        <div className="cart-empty">
          <div className="cart-empty__icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet. Explore our collection!</p>
          <Link to="/products" className="btn-primary-se">
            Start Shopping <Arrow />
          </Link>
          <div className="cart-empty__suggestions">
            <p>You might like:</p>
            <div className="suggestion-chips">
              {["Laptops", "Headphones", "Smart Watches", "Cameras"].map(s => (
                <Link key={s} to={`/products?cat=${s}`} className="suggestion-chip">{s}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page page-enter">
      <div className="cart-header">
        <div className="cart-header__inner">
          <div>
            <p className="section-label-sm">Review Your Selection</p>
            <h1>Shopping Cart</h1>
            <p className="cart-item-count">
              <strong>{cartCount}</strong> {cartCount === 1 ? "item" : "items"}
            </p>
          </div>
          {/* Redux dispatch: clearCart */}
          <button className="clear-cart-btn" onClick={handleClear}>
            Clear Cart
          </button>
        </div>
      </div>

      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items">
          {cartItems.map((item, i) => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={() => handleRemove(item.id)}
              onQty={(qty) => handleQty(item.id, qty)}
              delay={i * 80}
            />
          ))}
          <div className="cart-continue">
            <Link to="/products" className="btn-ghost-se">
              <BackArrow /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Summary */}
        <div className="cart-summary-col">
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal ({cartCount} items)</span>
                <span>₹{cartTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="summary-row">
                <span>GST (18%)</span>
                <span>₹{gst.toLocaleString("en-IN")}</span>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                <span className={delivery === 0 ? "free-delivery" : ""}>
                  {delivery === 0 ? "FREE" : `₹${delivery}`}
                </span>
              </div>
              {delivery === 0 && (
                <div className="free-delivery-banner">
                  🎉 You've unlocked free delivery!
                </div>
              )}
            </div>
            <div className="summary-divider" />
            <div className="summary-total">
              <span>Total</span>
              <span className="total-amount">₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="summary-note">
              Inclusive of all taxes. EMI from ₹{Math.round(grandTotal / 12).toLocaleString("en-IN")}/mo
            </div>
            <button className="btn-gold-se checkout-btn">
              Proceed to Checkout <Arrow />
            </button>
            <div className="payment-methods">
              {["UPI", "Cards", "NetBanking", "EMI", "COD"].map(m => (
                <span key={m} className="payment-chip">{m}</span>
              ))}
            </div>
            <div className="coupon-box">
              <h4>Have a coupon?</h4>
              <div className="coupon-input">
                <input type="text" placeholder="Enter coupon code" />
                <button>Apply</button>
              </div>
            </div>
            <div className="summary-trust">
              <div className="trust-row"><span>🔒</span><span>Secure & Encrypted Checkout</span></div>
              <div className="trust-row"><span>↩</span><span>30-Day Easy Returns</span></div>
              <div className="trust-row"><span>🚀</span><span>Fast Dispatch, Pan-India</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartItem({ item, onRemove, onQty, delay }) {
  return (
    <div className="cart-item" style={{ animationDelay: `${delay}ms` }}>
      <div className="cart-item__img-wrap">
        <img src={item.image} alt={item.name} loading="lazy" />
      </div>
      <div className="cart-item__info">
        <div className="cart-item__top">
          <div>
            <span className="tag-se" style={{ marginBottom: "6px", display: "inline-block" }}>
              {item.category}
            </span>
            <h3 className="cart-item__name">{item.name}</h3>
            <p className="cart-item__desc">{item.description}</p>
          </div>
          <button className="remove-btn" onClick={onRemove} aria-label="Remove">
            <TrashIcon />
          </button>
        </div>
        <div className="cart-item__features">
          {item.features.slice(0, 2).map((f, i) => (
            <span key={i} className="feature-chip">✓ {f}</span>
          ))}
        </div>
        <div className="cart-item__footer">
          <div className="qty-control">
            <button className="qty-btn" onClick={() => onQty(item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
            <span className="qty-value">{item.quantity}</span>
            <button className="qty-btn" onClick={() => onQty(item.quantity + 1)}>+</button>
          </div>
          <div className="cart-item__price">
            <span className="item-total">₹{(item.rawPrice * item.quantity).toLocaleString("en-IN")}</span>
            {item.quantity > 1 && <span className="item-unit-price">{item.price} each</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Arrow() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>; }
function BackArrow() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>; }
function TrashIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>; }