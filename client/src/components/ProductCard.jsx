import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

function StarRating({ rating }) {
  return (
    <span className="stars">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < Math.round(rating) ? '★' : '☆'}</span>
      ))}
    </span>
  );
}

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const navigate = useNavigate();

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="product-card-img">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.featured && (
          <span className="product-card-badge">Featured</span>
        )}
        <div className="product-card-actions" onClick={e => e.stopPropagation()}>
          <button className="action-btn" aria-label="Add to wishlist" title="Wishlist">
            <Heart size={16} />
          </button>
          <button
            className="action-btn"
            aria-label="Quick view"
            title="Quick view"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      <div className="product-card-body">
        <p className="product-artisan">{product.artisan}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <StarRating rating={product.rating} />
          <span className="rating-count">({product.reviews})</span>
        </div>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button
            className="add-to-cart"
            onClick={e => { e.stopPropagation(); addItem(product); }}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={15} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}