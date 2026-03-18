import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="logo-mark">🌿</div>
            <span className="logo-text">Artisan<span>Hub</span></span>
          </div>
          <p className="footer-desc">
            A curated marketplace celebrating master artisans and their handcrafted
            work. Every purchase supports independent makers.
          </p>
          <div className="footer-social">
            {['𝕏', 'in', 'ig', 'yt'].map(s => (
              <a key={s} href="#" className="social-btn" aria-label={s}>{s}</a>
            ))}
          </div>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/shop">All Products</Link></li>
            <li><Link to="/shop?category=Ceramics">Ceramics</Link></li>
            <li><Link to="/shop?category=Textiles">Textiles</Link></li>
            <li><Link to="/shop?category=Kitchen">Kitchen</Link></li>
            <li><Link to="/shop?featured=true">Featured</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Artisans</h4>
          <ul>
            <li><a href="#">Become a Seller</a></li>
            <li><a href="#">Artisan Stories</a></li>
            <li><a href="#">Craft Workshops</a></li>
            <li><a href="#">Sustainability</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Shipping & Returns</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} ArtisanHub. All rights reserved.</span>
        <span>Made with ♥ for craftsmanship</span>
      </div>
    </footer>
  );
}