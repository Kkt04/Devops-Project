import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, ArrowLeft, Package, RotateCcw, Shield, Star } from 'lucide-react';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';

function StarRating({ rating }) {
  return (
    <span className="stars">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{
          color: i < Math.round(rating) ? 'var(--gold)' : 'var(--mist)',
          fontSize: '1.1rem'
        }}>★</span>
      ))}
    </span>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
          <div style={{
            aspectRatio: '1',
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(90deg, var(--parchment) 25%, var(--mist) 50%, var(--parchment) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }} />
          <div>
            {[80, 50, 100, 60, 40].map((w, i) => (
              <div key={i} className="skeleton-line" style={{
                width: `${w}%`,
                height: i === 2 ? 40 : 16,
                marginBottom: 16
              }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <p style={{ fontSize: '3rem', marginBottom: 16 }}>😔</p>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>
          Product not found
        </h2>
        <Link to="/shop" className="btn-primary" style={{ display: 'inline-flex', marginTop: 8 }}>
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <main>
      <div className="container" style={{ padding: '32px 24px 80px' }}>
        <Link
          to="/shop"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--stone)',
            fontSize: '0.9rem',
            marginBottom: 32,
            transition: 'color 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--charcoal)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--stone)'}
        >
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
          {/* Image */}
          <div style={{ position: 'sticky', top: 100 }}>
            <div style={{
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              aspectRatio: '1',
              boxShadow: 'var(--shadow-xl)'
            }}>
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              />
            </div>
            {product.featured && (
              <div style={{
                marginTop: 12,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--forest)',
                color: 'var(--cream)',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                <Star size={13} /> Featured Product
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--clay)',
              marginBottom: 10
            }}>
              {product.category}
            </p>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: 16
            }}>
              {product.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <StarRating rating={product.rating} />
              <span style={{ fontSize: '0.9rem', color: 'var(--stone)' }}>
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Artisan chip */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '16px',
              background: 'var(--parchment)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 24
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'var(--clay)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--cream)', fontWeight: 700, fontSize: '1rem', flexShrink: 0
              }}>
                {product.artisan[0]}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>by {product.artisan}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--stone)' }}>
                  Verified Master Artisan
                </p>
              </div>
            </div>

            <p style={{ color: 'var(--stone)', lineHeight: 1.8, fontSize: '1rem', marginBottom: 28 }}>
              {product.description}
            </p>

            {/* Stock */}
            <div style={{ marginBottom: 24 }}>
              <span style={{
                fontSize: '0.82rem',
                color: product.stock > 5 ? 'var(--forest)' : 'var(--terracotta)',
                fontWeight: 600
              }}>
                {product.stock > 5
                  ? `✓ In Stock (${product.stock} available)`
                  : product.stock > 0
                  ? `⚠ Only ${product.stock} left!`
                  : '✗ Out of Stock'}
              </span>
            </div>

            {/* Price + Qty */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, flexWrap: 'wrap'
            }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700
              }}>
                ${product.price.toFixed(2)}
              </span>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 0,
                border: '1.5px solid var(--mist)', borderRadius: '40px', overflow: 'hidden'
              }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{
                    padding: '10px 18px', background: 'none', fontSize: '1.2rem',
                    color: 'var(--charcoal)', cursor: 'pointer', border: 'none', transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.target.style.background = 'var(--parchment)'}
                  onMouseLeave={e => e.target.style.background = 'none'}
                >−</button>
                <span style={{
                  padding: '0 16px', fontWeight: 600, fontSize: '1rem',
                  minWidth: 40, textAlign: 'center'
                }}>{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  style={{
                    padding: '10px 18px', background: 'none', fontSize: '1.2rem',
                    color: 'var(--charcoal)', cursor: 'pointer', border: 'none', transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.target.style.background = 'var(--parchment)'}
                  onMouseLeave={e => e.target.style.background = 'none'}
                >+</button>
              </div>
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
              <button
                className="btn-primary"
                style={{
                  flex: 1, justifyContent: 'center', padding: '16px', fontSize: '1rem',
                  background: added ? 'var(--forest-light)' : 'var(--forest)'
                }}
                onClick={handleAdd}
                disabled={product.stock === 0}
              >
                <ShoppingCart size={18} />
                {added ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>
              <button
                className="action-btn"
                style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: 'var(--parchment)', border: '1.5px solid var(--mist)', flexShrink: 0
                }}
                aria-label="Add to wishlist"
              >
                <Heart size={18} />
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { icon: <Package size={18} />, text: 'Free shipping $100+' },
                { icon: <RotateCcw size={18} />, text: '30-day returns' },
                { icon: <Shield size={18} />, text: 'Secure checkout' },
              ].map(b => (
                <div key={b.text} style={{
                  textAlign: 'center', padding: '12px 8px',
                  background: 'var(--parchment)', borderRadius: 'var(--radius-md)'
                }}>
                  <div style={{ color: 'var(--forest)', marginBottom: 6, display: 'flex', justifyContent: 'center' }}>
                    {b.icon}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--stone)', fontWeight: 500 }}>
                    {b.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}