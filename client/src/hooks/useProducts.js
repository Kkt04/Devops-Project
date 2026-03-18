import { useState, useEffect, useCallback } from 'react';

const API = import.meta.env.VITE_API_URL || '';

export function useProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.set('category', filters.category);
      if (filters.search) params.set('search', filters.search);
      if (filters.featured) params.set('featured', 'true');
      if (filters.sort) params.set('sort', filters.sort);

      const res = await fetch(`${API}/api/products?${params}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.search, filters.featured, filters.sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API}/api/products/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject('Not found'))
      .then(data => setProduct(data.data))
      .catch(e => setError(e.message || e))
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetch(`${API}/api/products/categories`)
      .then(r => r.json())
      .then(d => setCategories(d.data))
      .catch(() => {});
  }, []);
  return categories;
}