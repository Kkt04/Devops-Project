import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Artisans from './pages/Artisans';
import ThemeSettings from './pages/ThemeSettings';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <Toast />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/artisans" element={<Artisans />} />
            <Route path="/theme" element={<ThemeSettings />} />
            <Route path="*" element={
              <div style={{ textAlign: 'center', padding: '120px 24px' }}>
                <p style={{ fontSize: '4rem', marginBottom: 16 }}>🪴</p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 12 }}>
                  Page not found
                </h2>
                <a href="/" className="btn-primary" style={{ display: 'inline-flex', marginTop: 8 }}>
                  Go Home
                </a>
              </div>
            } />
          </Routes>
          <Footer />
        </CartProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}