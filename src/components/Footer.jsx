import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="se-footer">
      <div className="se-footer__inner">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-icon">◈</span>
            <span>ShopEase</span>
          </div>
          <p>Premium electronics and gadgets for the modern professional. Curated for excellence.</p>
          <div className="footer-socials">
            {["Twitter", "Instagram", "LinkedIn", "YouTube"].map(s => (
              <a key={s} href="#" className="social-btn" aria-label={s}>
                {s[0]}
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="footer-col">
          <h5>Shop</h5>
          <ul>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/products?cat=Electronics">Electronics</Link></li>
            <li><Link to="/products?cat=Audio">Audio</Link></li>
            <li><Link to="/products?cat=Wearables">Wearables</Link></li>
            <li><Link to="/products?cat=Gaming">Gaming</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Company</h5>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Partners</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Support</h5>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Track Order</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">Warranty</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter">
          <h5>Stay in the loop</h5>
          <p>Get exclusive deals, product launches and tech insights.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="your@email.com" />
            <button>→</button>
          </div>
          <div className="footer-trust">
            <span>🔒 SSL Secured</span>
            <span>⚡ Fast Delivery</span>
            <span>↩ Easy Returns</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 ShopEase Technologies Pvt. Ltd. All rights reserved.</span>
        <div className="footer-legal">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  );
}