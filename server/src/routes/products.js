const express = require('express');
const router = express.Router();
const db = require('../data/products');

// GET /api/products/categories
router.get('/categories', (req, res) => {
  res.json({ data: db.getCategories() });
});

// GET /api/products
router.get('/', (req, res) => {
  const { category, search, featured, sort } = req.query;

  let results = db.getAll();

  if (category) {
    results = results.filter(p => p.category === category);
  }

  if (featured === 'true') {
    results = results.filter(p => p.featured === true);
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.artisan.toLowerCase().includes(q)
    );
  }

  if (sort === 'price_asc') results.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') results.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') results.sort((a, b) => b.rating - a.rating);

  res.json({ data: results, count: results.length });
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = db.getById(parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ data: product });
});

// POST /api/products
router.post('/', (req, res) => {
  const { name, price, category, artisan } = req.body;
  if (!name || !price || !category || !artisan) {
    return res.status(400).json({ error: 'name, price, category and artisan are required' });
  }
  const product = db.create(req.body);
  res.status(201).json({ data: product });
});

// PUT /api/products/:id
router.put('/:id', (req, res) => {
  const product = db.update(parseInt(req.params.id), req.body);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ data: product });
});

// DELETE /api/products/:id
router.delete('/:id', (req, res) => {
  const deleted = db.remove(parseInt(req.params.id));
  if (!deleted) return res.status(404).json({ error: 'Product not found' });
  res.json({ message: 'Product deleted successfully' });
});

module.exports = router;