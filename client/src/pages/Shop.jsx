import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { useProducts, useCategories } from '../hooks/useProducts';

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('');
  const [featured, setFeatured] = useState(searchParams.get('featured') === 'true');
  const [showFilters, setShowFilters] = useState(false);

  const categories = useCategories();
  const { products, loading } = useProducts({ category, search, sort, featured: featured || undefined });

  useEffect(() => {
    const params = {};
    if (category) params.category = category;
    if (search) params.search = search;
    if (featured) params.featured = 'true';
    setSearchParams(params);
  }, [category, search, featured, setSearchParams]);

  const clearFilters = () => { setCategory(''); setSearch(''); setSort(''); setFeatured(false); };
  const hasFilters = category || search || sort || featured;

  return (
    <main style={{ minHeight: '100vh' }}>
      <div style={{ background: 'var(--parchment)', padding: '48px 0 32px', borderBottom: '1px solid var(--mist)' }}>
        <div className="container">
          <p className="section-eyebrow">Our Collection</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Handcrafted Goods
            </h1>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <select value={sort} onChange={e => setSort(e.target.value)}
                style={{ padding: '10px 16px', border: '1.5px solid var(--mist)', borderRadius: 'var(--radius-xl)', background: 'var(--warm-white)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', cursor: 'pointer', color: 'var(--charcoal)' }}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <button className={`category-pill ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <SlidersHorizontal size={15} /> Filters
              </button>
              {hasFilters && (
                <button onClick={clearFilters} className="category-pill"
                  style={{ color: 'var(--terracotta)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <X size={14} /> Clear
                </button>
              )}
            </div>
          </div>

          {showFilters && (
            <div style={{ marginTop: 24, padding: '20px 24px', background: 'var(--warm-white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--mist)', display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--stone)', display: 'block', marginBottom: 8 }}>Category</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button className={`category-pill ${!category ? 'active' : ''}`} onClick={() => setCategory('')} style={{ padding: '7px 16px', fontSize: '0.82rem' }}>All</button>
                  {categories.map(c => (
                    <button key={c} className={`category-pill ${category === c ? 'active' : ''}`} onClick={() => setCategory(c === category ? '' : c)} style={{ padding: '7px 16px', fontSize: '0.82rem' }}>{c}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" id="featured" checked={featured} onChange={e => setFeatured(e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--forest)' }} />
                <label htmlFor="featured" style={{ fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}>Featured only</label>
              </div>
            </div>
          )}
        </div>
      </div>

      <section className="products-section">
        <div className="container">
          {hasFilters && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
              {category && <span style={{ background: 'var(--forest)', color: 'var(--cream)', padding: '5px 14px', borderRadius: 20, fontSize: '0.82rem', fontWeight: 500 }}>{category}</span>}
              {featured && <span style={{ background: 'var(--clay)', color: 'var(--cream)', padding: '5px 14px', borderRadius: 20, fontSize: '0.82rem', fontWeight: 500 }}>Featured</span>}
              {search && <span style={{ background: 'var(--bark)', color: 'var(--cream)', padding: '5px 14px', borderRadius: 20, fontSize: '0.82rem', fontWeight: 500 }}>&ldquo;{search}&rdquo;</span>}
            </div>
          )}
          <p style={{ color: 'var(--stone)', fontSize: '0.9rem', marginBottom: 28 }}>
            {loading ? 'Loading…' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
          </p>
          {loading ? (
            <div className="loading">{Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)}</div>
          ) : products.length > 0 ? (
            <div className="products-grid">{products.map(p => <ProductCard key={p.id} product={p} />)}</div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--stone)' }}>
              <p style={{ fontSize: '3rem', marginBottom: 16 }}>🪴</p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: 10, color: 'var(--charcoal)' }}>No products found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}