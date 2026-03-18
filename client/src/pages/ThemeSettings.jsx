import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ThemeSettings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <main className="theme-page">
      <div className="container">
        <div className="theme-header">
          <p className="section-eyebrow">Customize</p>
          <h1 className="theme-title">Appearance</h1>
          <p className="theme-desc">
            Choose how ArtisanHub looks to you. Your preference is saved automatically.
          </p>
        </div>

        <div className="theme-grid">
          <div className="theme-card">
            <div className="theme-preview light-preview">
              <div className="preview-navbar">
                <div className="preview-logo">🌿</div>
                <div className="preview-links">
                  <span />
                  <span />
                </div>
              </div>
              <div className="preview-content">
                <div className="preview-hero" />
                <div className="preview-cards">
                  <div className="preview-card" />
                  <div className="preview-card" />
                </div>
              </div>
            </div>
            <div className="theme-card-footer">
              <div className="theme-info">
                <Sun size={18} />
                <span>Light</span>
              </div>
              <button 
                className={`theme-select ${theme === 'light' ? 'active' : ''}`}
                onClick={() => theme !== 'light' && toggleTheme()}
              >
                {theme === 'light' && <span className="check">✓</span>}
              </button>
            </div>
          </div>

          <div className="theme-card">
            <div className="theme-preview dark-preview">
              <div className="preview-navbar">
                <div className="preview-logo">🌿</div>
                <div className="preview-links">
                  <span />
                  <span />
                </div>
              </div>
              <div className="preview-content">
                <div className="preview-hero" />
                <div className="preview-cards">
                  <div className="preview-card" />
                  <div className="preview-card" />
                </div>
              </div>
            </div>
            <div className="theme-card-footer">
              <div className="theme-info">
                <Moon size={18} />
                <span>Dark</span>
              </div>
              <button 
                className={`theme-select ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => theme !== 'dark' && toggleTheme()}
              >
                {theme === 'dark' && <span className="check">✓</span>}
              </button>
            </div>
          </div>
        </div>

        <div className="theme-toggle-section">
          <div className="toggle-container">
            <div className="toggle-label">
              <div className="toggle-icon">
                {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
              </div>
              <div>
                <h3>Current theme: {theme === 'light' ? 'Light' : 'Dark'}</h3>
                <p>Click the cards above to switch themes</p>
              </div>
            </div>
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              <Palette size={18} />
              Switch to {theme === 'light' ? 'Dark' : 'Light'}
            </button>
          </div>
        </div>

        <div className="theme-features">
          <div className="feature-item">
            <div className="feature-icon"><Monitor size={20} /></div>
            <div>
              <h4>Persistent</h4>
              <p>Your preference is saved automatically and remembered across sessions.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><Palette size={20} /></div>
            <div>
              <h4>Smooth transitions</h4>
              <p>Theme changes animate smoothly for a polished experience.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}