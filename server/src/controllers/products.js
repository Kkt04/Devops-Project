const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/products
const getAllProducts = async (req, res) => {
  try {
    const { category, search, featured, sort } = req.query;

    let where = {};
    if (category) where.category = category;
    if (featured === 'true') where.featured = true;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { artisan: { contains: search } }
      ];
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'rating') orderBy = { rating: 'desc' };

    const products = await prisma.product.findMany({ where, orderBy });
    res.json({ data: products, count: products.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ data: product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, artisan, stock } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        category,
        artisan,
        stock: parseInt(stock) || 10
      }
    });
    res.status(201).json({ data: product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json({ data: product });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Product not found' });
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Product not found' });
    res.status(500).json({ error: err.message });
  }
};

// GET /api/products/categories
const getCategories = async (req, res) => {
  try {
    const products = await prisma.product.findMany({ select: { category: true } });
    const categories = [...new Set(products.map(p => p.category))];
    res.json({ data: categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
};