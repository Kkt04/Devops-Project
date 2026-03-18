import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
const p1 = { id: 1, name: 'Bowl', price: 48, artisan: 'Maya', image: '', stock: 8 };
const p2 = { id: 2, name: 'Knife', price: 195, artisan: 'Hana', image: '', stock: 4 };

describe('useCart', () => {
  it('starts with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
    expect(result.current.count).toBe(0);
  });
  it('adds item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(p1));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.count).toBe(1);
  });
  it('increments quantity for duplicate item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(p1));
    act(() => result.current.addItem(p1));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });
  it('handles multiple different items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(p1));
    act(() => result.current.addItem(p2));
    expect(result.current.items).toHaveLength(2);
  });
  it('removes item', () => {
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
  it('calculates total with quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(p1));
    act(() => result.current.addItem(p1));
    expect(result.current.total).toBe(96);
  });
  it('updates quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(p1));
    act(() => result.current.updateQty(1, 5));
    expect(result.current.items[0].quantity).toBe(5);
  });
  it('removes item when qty set to 0', () => {
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
  it('throws outside CartProvider', () => {
    expect(() => renderHook(() => useCart())).toThrow();
  });
});