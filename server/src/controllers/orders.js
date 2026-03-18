const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { email, items } = req.body;

    if (!email || !items || items.length === 0) {
      return res.status(400).json({ error: 'Email and items are required' });
    }

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });
      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }
      total += product.price * item.quantity;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price
      });
    }

    const order = await prisma.order.create({
      data: {
        email,
        total,
        items: { create: orderItems }
      },
      include: { items: { include: { product: true } } }
    });

    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }

    res.status(201).json({ data: order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/orders/:id
const getOrder = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { items: { include: { product: true } } }
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ data: order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createOrder, getOrder };