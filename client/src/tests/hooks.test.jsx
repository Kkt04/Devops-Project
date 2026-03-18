import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

const p1 = { id: 1, name: 'Bowl', price: 48, artisan: 'Maya', image: '', stock: 8 };
const p2 = { id: 2, name: 'Knife', price: 195, artisan: 'Hana', image: '', stock: 4 };

describe('useCart', () => {
  it('initializes with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
    expect(result.current.count).toBe(0);
  });

  it('adds item to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(p1));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe('Bowl');
    expect(result.current.count).toBe(1);
  });

  it('increments quantity when same item added twice', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(p1));
    act(() => result.current.addItem(p1));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.count).toBe(2);
  });

  it('adds multiple different items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(p1));
    act(() => result.current.addItem(p2));
    expect(result.current.items).toHaveLength(2);
  });

  it('removes item from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(p1));
    act(() => result.current.removeItem(1));
    expect(result.current.items).toHaveLength(0);
  });

  it('calculates total correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(p1));
    act(() => result.current.addItem(p2));
    expect(result.current.total).toBe(243);
  });

  it('calculates total with multiple quantities', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(p1));
    act(() => result.current.addItem(p1));
    expect(result.current.total).toBe(96);
  });

  it('updates item quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(p1));
    act(() => result.current.updateQty(1, 3));
    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.count).toBe(3);
  });

  it('removes item when qty updated to 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(p1));
    act(() => result.current.updateQty(1, 0));
    expect(result.current.items).toHaveLength(0);
  });

  it('clears all items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(p1));
    act(() => result.current.addItem(p2));
    act(() => result.current.clearCart());
    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
  });

  it('throws error outside CartProvider', () => {
    expect(() => renderHook(() => useCart())).toThrow();
  });

  it('handles zero price product', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const free = { id: 99, name: 'Sample', price: 0, artisan: 'Test', image: '', stock: 5 };
    act(() => result.current.addItem(free));
    expect(result.current.total).toBe(0);
  });
});