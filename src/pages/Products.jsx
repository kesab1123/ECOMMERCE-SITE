import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { products, categories } from "../data/products";
import ProductCard from "../components/ProductCard";
import "./Products.css";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("cat") || "All"
  );
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  // ═══════════════════════════════════════════
  // MEMOIZED FILTERING (useMemo optimization)
  // ═══════════════════════════════════════════
  const filtered = useMemo(() => {
    let list = [...products];

    // Filter by category
    if (activeCategory !== "All") {
      list = list.filter(p => p.category === activeCategory);
    }

    // Filter by search query
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Sort results
    switch (sort) {
      case "price-asc":  list.sort((a, b) => a.rawPrice - b.rawPrice); break;
      case "price-desc": list.sort((a, b) => b.rawPrice - a.rawPrice); break;
      case "rating":     list.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }

    return list;
  }, [activeCategory, search, sort]);

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    if (cat === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ cat });
    }
  };

  return (
    <div className="products-page page-enter">
      {/* Page Header */}
      <div className="products-header">
        <div className="products-header__inner">
          <div className="products-header__text">
            <p className="section-label-sm">Explore Our Range</p>
            <h1>All Products</h1>
            <p className="products-count">
              Showing <strong>{filtered.length}</strong> products
              {activeCategory !== "All" && ` in "${activeCategory}"`}
            </p>
          </div>
          <div className="products-breadcrumb">
            <span>Home</span>
            <span className="crumb-sep">›</span>
            <span className="crumb-active">Products</span>
            {activeCategory !== "All" && (
              <>
                <span className="crumb-sep">›</span>
                <span className="crumb-active">{activeCategory}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="products-layout">
        {/* Sidebar / Filters */}
        <aside className="products-sidebar">
          <div className="sidebar-section">
            <h4>Categories</h4>
            <ul className="cat-list">
              {categories.map(cat => (
                <li key={cat}>
                  <button
                    className={`cat-btn ${activeCategory === cat ? "active" : ""}`}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    <span>{cat}</span>
                    <span className="cat-count">
                      {cat === "All" ? products.length : products.filter(p => p.category === cat).length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-section">
            <h4>Price Range</h4>
            <div className="price-filters">
              {[
                "Under ₹10,000",
                "₹10,000 – ₹50,000",
                "₹50,000 – ₹1,00,000",
                "Above ₹1,00,000",
              ].map(range => (
                <label key={range} className="checkbox-row">
                  <input type="checkbox" />
                  <span>{range}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h4>Rating</h4>
            <div className="rating-filters">
              {[4.8, 4.5, 4.0].map(r => (
                <label key={r} className="checkbox-row">
                  <input type="checkbox" />
                  <span>{"★".repeat(Math.floor(r))} & above</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="products-main">
          {/* Toolbar */}
          <div className="products-toolbar">
            <div className="toolbar-search">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="clear-search" onClick={() => setSearch("")}>✕</button>
              )}
            </div>

            <div className="toolbar-right">
              <select
                className="sort-select"
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              <div className="view-toggle">
                <button
                  className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                >
                  <GridIcon />
                </button>
                <button
                  className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                >
                  <ListIcon />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Pills */}
          {activeCategory !== "All" && (
            <div className="active-filters">
              <span className="filter-pill">
                {activeCategory}
                <button onClick={() => handleCategoryClick("All")}>✕</button>
              </span>
            </div>
          )}

          {/* Products Grid */}
          {filtered.length > 0 ? (
            <div className={`products-grid-main ${viewMode}`}>
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={i * 60} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your search or filter criteria.</p>
              <button className="btn-primary-se" onClick={() => {
                setSearch("");
                handleCategoryClick("All");
              }}>
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function SearchIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}
function GridIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
}
function ListIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
}