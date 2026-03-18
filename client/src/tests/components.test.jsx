import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';

const mockProduct = {
  id: 1, name: 'Hand-Thrown Ceramic Bowl', artisan: 'Maya Okonkwo',
  price: 48.00, image: 'https://example.com/img.jpg', rating: 4.9,
  reviews: 127, featured: true, stock: 8, category: 'Ceramics', description: 'A beautiful bowl'
};

const wrap = (ui) => render(<MemoryRouter><CartProvider>{ui}</CartProvider></MemoryRouter>);

describe('ProductCard', () => {
  it('renders product name', () => {
    wrap(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Hand-Thrown Ceramic Bowl')).toBeInTheDocument();
  });
  it('renders artisan name', () => {
    wrap(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Maya Okonkwo')).toBeInTheDocument();
  });
  it('renders price correctly', () => {
    wrap(<ProductCard product={mockProduct} />);
    expect(screen.getByText('$48.00')).toBeInTheDocument();
  });
  it('shows Featured badge when featured', () => {
    wrap(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });
  it('hides Featured badge when not featured', () => {
    wrap(<ProductCard product={{ ...mockProduct, featured: false }} />);
    expect(screen.queryByText('Featured')).not.toBeInTheDocument();
  });
  it('has Add button', () => {
    wrap(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Add')).toBeInTheDocument();
  });
  it('shows review count', () => {
    wrap(<ProductCard product={mockProduct} />);
    expect(screen.getByText('(127)')).toBeInTheDocument();
  });
  it('formats whole-number price with 2 decimals', () => {
    wrap(<ProductCard product={{ ...mockProduct, price: 100 }} />);
    expect(screen.getByText('$100.00')).toBeInTheDocument();
  });
});

describe('SkeletonCard', () => {
  it('renders skeleton wrapper', () => {
    const { container } = render(<SkeletonCard />);
    expect(container.querySelector('.skeleton')).toBeInTheDocument();
  });
  it('renders skeleton image placeholder', () => {
    const { container } = render(<SkeletonCard />);
    expect(container.querySelector('.skeleton-img')).toBeInTheDocument();
  });
  it('renders multiple skeleton lines', () => {
    const { container } = render(<SkeletonCard />);
    expect(container.querySelectorAll('.skeleton-line').length).toBeGreaterThanOrEqual(2);
  });
});