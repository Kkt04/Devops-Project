const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ArtisanHub Backend is running',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;