import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Sun, Moon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { count, setIsOpen } = useCart();
  const { theme } = useTheme();
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
          <Link to="/theme" className="nav-link" title="Theme settings">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </Link>
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