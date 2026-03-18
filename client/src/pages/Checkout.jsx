import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock, Check, Package, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  const shipping = total >= 100 ? 0 : 9.99;
  const tax = total * 0.08;
  const grandTotal = total + shipping + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cardNumber') {
      const formatted = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
      setFormData(prev => ({ ...prev, [name]: formatted.slice(0, 19) }));
    } else if (name === 'expiry') {
      const formatted = value.replace(/\D/g, '').replace(/(.{2})/, '$1/').trim();
      setFormData(prev => ({ ...prev, [name]: formatted.slice(0, 5) }));
    } else if (name === 'cvv') {
      setFormData(prev => ({ ...prev, [name]: value.replace(/\D/g, '').slice(0, 4) }));
    } else if (name === 'phone') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateShipping = () => {
    return formData.firstName && formData.lastName && formData.email && 
           formData.address && formData.city && formData.state && formData.zip;
  };

  const validatePayment = () => {
    return formData.cardNumber.length === 19 && formData.cardName && 
           formData.expiry.length === 5 && formData.cvv.length >= 3;
  };

  const handleContinueToPayment = () => {
    if (validateShipping()) {
      setStep(2);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validatePayment()) return;
    
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newOrderId = 'AH-' + Date.now().toString(36).toUpperCase();
    setOrderId(newOrderId);
    setOrderComplete(true);
    clearCart();
    setIsProcessing(false);
  };

  if (orderComplete) {
    return (
      <main className="checkout-page">
        <div className="checkout-container">
          <div className="order-success">
            <div className="success-icon">
              <Check size={40} />
            </div>
            <h1>Order Confirmed!</h1>
            <p className="order-id">Order #{orderId}</p>
            <p className="success-message">
              Thank you for your purchase. We&apos;ve sent a confirmation email to <strong>{formData.email}</strong>.
            </p>
            <div className="order-details-card">
              <div className="detail-row">
                <Package size={18} />
                <span>Estimated delivery: 5-7 business days</span>
              </div>
              <div className="detail-row">
                <Truck size={18} />
                <span>Shipping to: {formData.address}, {formData.city}, {formData.state}</span>
              </div>
            </div>
            <Link to="/shop" className="btn-primary" style={{ marginTop: '32px' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (items.length === 0 && !orderComplete) {
    return (
      <main className="checkout-page">
        <div className="checkout-container">
          <div className="empty-checkout">
            <div className="empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some items to your cart before checking out.</p>
            <Link to="/shop" className="btn-primary" style={{ marginTop: '24px' }}>
              Browse Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <Link to="/shop" className="back-link">
            <ArrowLeft size={18} />
            Back to Shop
          </Link>
          <h1 className="checkout-title">Checkout</h1>
        </div>

        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">{step > 1 ? <Check size={14} /> : '1'}</div>
            <span>Shipping</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-number">{step > 2 ? <Check size={14} /> : '2'}</div>
            <span>Payment</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Confirmation</span>
          </div>
        </div>

        <div className="checkout-content">
          <div className="checkout-form-section">
            {step === 1 && (
              <div className="form-section">
                <h2><Truck size={20} /> Shipping Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Smith"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john.smith@example.com"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Craft Street, Apt 4B"
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="San Francisco"
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="CA"
                    />
                  </div>
                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      placeholder="94102"
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <select name="country" value={formData.country} onChange={handleInputChange}>
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                      <option>Germany</option>
                      <option>France</option>
                    </select>
                  </div>
                </div>
                <button 
                  className="btn-primary continue-btn"
                  onClick={handleContinueToPayment}
                  disabled={!validateShipping()}
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="form-section">
                <h2><CreditCard size={20} /> Payment Details</h2>
                <div className="secure-badge">
                  <Lock size={14} />
                  <span>Secure checkout powered by Stripe</span>
                </div>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Card Number</label>
                    <div className="card-input-wrapper">
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                      />
                      <CreditCard size={18} className="card-icon" />
                    </div>
                  </div>
                  <div className="form-group full-width">
                    <label>Name on Card</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="JOHN SMITH"
                    />
                  </div>
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                    />
                  </div>
                </div>
                <div className="payment-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft size={16} />
                    Back
                  </button>
                  <button 
                    className="btn-primary place-order-btn"
                    onClick={handlePlaceOrder}
                    disabled={!validatePayment() || isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <span className="spinner"></span>
                        Processing...
                      </>
                    ) : (
                      <>Place Order • ${grandTotal.toFixed(2)}</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {items.map(item => (
                <div key={item.id} className="summary-item">
                  <div className="item-img">
                    <img src={item.image} alt={item.name} />
                    <span className="item-qty">{item.quantity}</span>
                  </div>
                  <div className="item-details">
                    <p className="item-name">{item.name}</p>
                    <p className="item-artisan">by {item.artisan}</p>
                  </div>
                  <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="free-tag">FREE</span> : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-row">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            {shipping > 0 && (
              <p className="free-shipping-note">
                Add ${(100 - total).toFixed(2)} more for free shipping!
              </p>
            )}
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
