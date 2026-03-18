import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { count, setIsOpen } = useCart();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="logo-mark">🌿</div>
          <span className="logo-text">Artisan<span>Hub</span></span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search handcrafted goods…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </form>

        <div className="navbar-actions">
          <Link to="/shop" className="nav-link">Shop</Link>
          <Link to="/artisans" className="nav-link">Artisans</Link>
          <button
            className="cart-btn"
            onClick={() => setIsOpen(true)}
            aria-label="Open cart"
          >
            <ShoppingBag size={18} />
            Cart
            {count > 0 && <span className="cart-badge">{count}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}