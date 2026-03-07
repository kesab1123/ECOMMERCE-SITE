import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-page">

      {/* ── Hero Section ─────────────────────────── */}
      <section className="home-hero">
        <div className="home-hero__inner">
          <div className="home-hero__text">
            <p className="section-label-sm">Premium Electronics Store</p>
            <h1 className="home-hero__title">
              Welcome to <span className="text-gold">ShopEase</span>
            </h1>
            <p className="home-hero__sub">
              Your one-stop online store for premium electronics,
              audio gear, wearables, and more. Curated for excellence.
            </p>
            <div className="home-hero__btns">
              <Link to="/products" className="btn-primary-se">
                Shop Now <Arrow />
              </Link>
              <Link to="/analytics" className="btn-ghost-se">
                View Analytics
              </Link>
            </div>
          </div>

          <div className="home-hero__image">
            <img
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"
              alt="ShopEase Premium Electronics"
            />
            <div className="home-hero__badge">
              <span>⭐</span>
              <div>
                <strong>4.9 / 5</strong>
                <span>Trusted by 50K+</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────── */}
      <section className="home-stats">
        <div className="home-stats__inner">
          {[
            { value: "9+",    label: "Premium Products" },
            { value: "50K+",  label: "Happy Customers"  },
            { value: "4.8★",  label: "Average Rating"   },
            { value: "Free",  label: "Delivery on ₹5K+" },
          ].map((stat) => (
            <div key={stat.label} className="home-stat">
              <span className="home-stat__val">{stat.value}</span>
              <span className="home-stat__lbl">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ───────────────────────────── */}
      <section className="home-categories">
        <div className="home-section__inner">
          <p className="section-label-sm">Browse By</p>
          <h2>Shop Categories</h2>
          <div className="home-cats-grid">
            {[
              { name: "Electronics",  emoji: "💻", cat: "Electronics"  },
              { name: "Audio",        emoji: "🎧", cat: "Audio"        },
              { name: "Wearables",    emoji: "⌚", cat: "Wearables"   },
              { name: "Photography",  emoji: "📷", cat: "Photography"  },
              { name: "Gaming",       emoji: "🎮", cat: "Gaming"       },
              { name: "Accessories",  emoji: "🖱️", cat: "Accessories"  },
            ].map((c) => (
              <Link key={c.name} to={`/products?cat=${c.cat}`} className="home-cat-card">
                <span className="home-cat-card__emoji">{c.emoji}</span>
                <span className="home-cat-card__name">{c.name}</span>
                <Arrow />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features / Why Us ────────────────────── */}
      <section className="home-features">
        <div className="home-section__inner">
          <p className="section-label-sm">Why ShopEase</p>
          <h2>Built for the Modern Buyer</h2>
          <div className="home-features-grid">
            {[
              { icon: "🔒", title: "Secure Payments",   desc: "SSL-encrypted checkout with UPI, Cards, EMI & COD."      },
              { icon: "🚀", title: "Fast Dispatch",      desc: "Same-day dispatch on orders placed before 2 PM."         },
              { icon: "↩",  title: "30-Day Returns",    desc: "Hassle-free returns on all products, no questions asked." },
              { icon: "⭐", title: "Curated Quality",   desc: "Every product is hand-picked and quality-verified."       },
            ].map((f) => (
              <div key={f.title} className="home-feature-card">
                <div className="home-feature-card__icon">{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="home-cta">
        <div className="home-cta__inner">
          <h2>Ready to upgrade your tech?</h2>
          <p>Explore our full collection of premium products.</p>
          <Link to="/products" className="btn-gold-se">
            Browse All Products <Arrow />
          </Link>
        </div>
      </section>

    </div>
  );
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}