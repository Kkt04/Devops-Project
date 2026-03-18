const express = require('express');
const router = express.Router();
const db = require('../data/products');

const orders = [];
let nextOrderId = 1;

// POST /api/orders
router.post('/', (req, res) => {
  const { email, items } = req.body;

  if (!email || !items || items.length === 0) {
    return res.status(400).json({ error: 'Email and items are required' });
  }

  const orderItems = [];
  let total = 0;

  for (const item of items) {
    const product = db.getById(item.productId);
    if (!product) {
      return res.status(404).json({ error: `Product ${item.productId} not found` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
    }
    total += product.price * item.quantity;
    orderItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity
    });
    // Decrement stock in-memory
    db.update(product.id, { stock: product.stock - item.quantity });
  }

  const order = {
    id: nextOrderId++,
    email,
    items: orderItems,
    total,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  orders.push(order);
  res.status(201).json({ data: order });
});

// GET /api/orders/:id
router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ data: order });
});

module.exports = router;