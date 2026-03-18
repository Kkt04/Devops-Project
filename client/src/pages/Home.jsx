import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Award } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { useProducts, useCategories } from '../hooks/useProducts';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800',
  'https://images.unsplash.com/photo-1604014137254-f9be42e6cbdf?w=500',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
];

const ARTISAN_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120';

const BANNER_IMGS = [
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400',
  'https://images.unsplash.com/photo-1604014137254-f9be42e6cbdf?w=400',
  'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400',
];

const VALUES = [
  { icon: '🤲', title: 'Handmade Always', desc: 'Every item crafted by a real human being, with real care' },
  { icon: '🌱', title: 'Sustainably Sourced', desc: 'Natural materials, ethical practices, low-impact packaging' },
  { icon: '🚚', title: 'Free Shipping $100+', desc: 'Worldwide shipping on qualifying orders' },
  { icon: '💫', title: 'Satisfaction Guarantee', desc: '30-day returns on all purchases, no questions asked' },
];

export default function Home() {
  const categories = useCategories();
  const [activeCategory, setActiveCategory] = useState(null);

  const { products: featured, loading: loadingFeatured } =
    useProducts({ featured: true });
  const { products: filtered, loading: loadingFiltered } =
    useProducts(activeCategory ? { category: activeCategory } : {});

  const displayProducts = activeCategory ? filtered : featured;
  const isLoading = activeCategory ? loadingFiltered : loadingFeatured;

  return (
    <main>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            New arrivals this week
          </div>
          <h1 className="hero-title">
            Where <em>craft</em> meets<br />intention
          </h1>
          <p className="hero-subtitle">
            Discover beautifully handcrafted goods from independent artisans
            worldwide. Each piece tells a story of skill, patience, and love.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn-primary">
              <Sparkles size={18} />
              Explore the Collection
            </Link>
            <Link to="/artisans" className="btn-secondary">
              Meet the Makers <ArrowRight size={16} />
            </Link>
          </div>
          <div className="hero-stats">
            <div>
              <div className="stat-num">2,400+</div>
              <div className="stat-label">Unique Products</div>
            </div>
            <div>
              <div className="stat-num">380+</div>
              <div className="stat-label">Master Artisans</div>
            </div>
            <div>
              <div className="stat-num">52</div>
              <div className="stat-label">Countries</div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-img-grid">
            <img className="img-main" src={HERO_IMAGES[0]} alt="Hand-thrown ceramic" />
            <img className="img-top" src={HERO_IMAGES[1]} alt="Macramé wall hanging" />
            <img className="img-bottom" src={HERO_IMAGES[2]} alt="Leather journal" />
          </div>
          <div className="hero-float-card">
            <img className="float-avatar" src={ARTISAN_AVATAR} alt="Maya Okonkwo" />
            <div>
              <div className="float-name">Maya Okonkwo</div>
              <div className="float-title">Master Ceramicist · Lagos</div>
              <div className="float-stars">★★★★★ 4.9</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <div className="container">
        <div className="values-strip">
          {VALUES.map(v => (
            <div key={v.title} className="value-item">
              <div className="value-icon">{v.icon}</div>
              <div className="value-title">{v.title}</div>
              <div className="value-desc">{v.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Categories ── */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Browse by craft</p>
              <h2 className="section-title">Shop by Category</h2>
            </div>
            <Link to="/shop" className="section-link">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="categories-grid">
            <button
              className={`category-pill ${!activeCategory ? 'active' : ''}`}
              onClick={() => setActiveCategory(null)}
            >
              ✨ All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products ── */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">{activeCategory || 'Featured picks'}</p>
              <h2 className="section-title">
                {activeCategory ? `${activeCategory} Collection` : 'Handpicked for You'}
              </h2>
            </div>
            <Link
              to={activeCategory ? `/shop?category=${activeCategory}` : '/shop'}
              className="section-link"
            >
              See all <ArrowRight size={16} />
            </Link>
          </div>

          {isLoading ? (
            <div className="loading">
              {Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="products-grid">
              {displayProducts.slice(0, 8).map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {!isLoading && displayProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--stone)' }}>
              <p style={{ fontSize: '2rem', marginBottom: 12 }}>🔍</p>
              <p>No products found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Artisan Banner ── */}
      <div className="container">
        <div className="artisan-banner">
          <div>
            <span className="banner-tag">Join our community</span>
            <h2 className="banner-title">
              Are you a maker?<br />Sell on ArtisanHub
            </h2>
            <p className="banner-text">
              Join over 380 independent artisans selling their work to a global
              audience who values craft, quality, and story. No listing fees.
              Transparent pricing.
            </p>
            <a href="#" className="btn-light">
              <Award size={18} />
              Apply as an Artisan
            </a>
          </div>
          <div className="banner-images">
            {BANNER_IMGS.map((src, i) => (
              <img key={i} src={src} alt={`Artisan craft ${i + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}