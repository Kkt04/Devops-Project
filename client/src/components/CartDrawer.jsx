import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { items, total, isOpen, setIsOpen, removeItem, updateQty } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsOpen(false)} />
      <aside className={`cart-drawer ${isOpen ? 'open' : ''}`} aria-label="Shopping cart">
        <div className="cart-header">
          <h2 className="cart-title">Your Cart</h2>
          <button className="close-btn" onClick={() => setIsOpen(false)} aria-label="Close cart">
            <X size={18} />
          </button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Add some handcrafted goods to get started</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="cart-item">
                <img className="cart-item-img" src={item.image} alt={item.name} />
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-artisan">by {item.artisan}</p>
                  <div className="cart-item-qty">
                    <button className="qty-btn" onClick={() => updateQty(item.id, item.quantity - 1)} aria-label="Decrease">
                      <Minus size={12} />
                    </button>
                    <span className="qty-val">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.id, item.quantity + 1)} aria-label="Increase">
                      <Plus size={12} />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--stone)', fontSize: '0.78rem', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-amount">${total.toFixed(2)}</span>
            </div>
            <button className="checkout-btn">
              <ShoppingBag size={18} />
              Proceed to Checkout
              <ArrowRight size={16} />
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--stone)', marginTop: 12 }}>
              Free shipping on orders over $100
            </p>
          </div>
        )}
      </aside>
    </>
  );
}