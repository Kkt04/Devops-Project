const request = require('supertest');
const app = require('../app');

describe('GET /api/health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('GET /api/products', () => {
  it('returns products array with count', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty('count');
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('filters by category', async () => {
    const res = await request(app).get('/api/products?category=Ceramics');
    expect(res.statusCode).toBe(200);
    res.body.data.forEach(p => expect(p.category).toBe('Ceramics'));
  });

  it('filters featured products', async () => {
    const res = await request(app).get('/api/products?featured=true');
    expect(res.statusCode).toBe(200);
    res.body.data.forEach(p => expect(p.featured).toBe(true));
  });

  it('searches by name', async () => {
    const res = await request(app).get('/api/products?search=ceramic');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('sorts by price ascending', async () => {
    const res = await request(app).get('/api/products?sort=price_asc');
    expect(res.statusCode).toBe(200);
    const prices = res.body.data.map(p => p.price);
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });

  it('sorts by price descending', async () => {
    const res = await request(app).get('/api/products?sort=price_desc');
    expect(res.statusCode).toBe(200);
    const prices = res.body.data.map(p => p.price);
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
    }
  });

  it('sorts by rating', async () => {
    const res = await request(app).get('/api/products?sort=rating');
    expect(res.statusCode).toBe(200);
    const ratings = res.body.data.map(p => p.rating);
    for (let i = 1; i < ratings.length; i++) {
      expect(ratings[i]).toBeLessThanOrEqual(ratings[i - 1]);
    }
  });
});

describe('GET /api/products/categories', () => {
  it('returns array of category strings', async () => {
    const res = await request(app).get('/api/products/categories');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    res.body.data.forEach(c => expect(typeof c).toBe('string'));
  });
});

describe('GET /api/products/:id', () => {
  it('returns a product for valid id', async () => {
    const res = await request(app).get('/api/products/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('name');
    expect(res.body.data).toHaveProperty('price');
    expect(res.body.data.id).toBe(1);
  });

  it('returns 404 for non-existent id', async () => {
    const res = await request(app).get('/api/products/99999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

describe('POST /api/products', () => {
  it('creates a new product', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({
        name: 'Test Vase',
        price: 40,
        category: 'Ceramics',
        artisan: 'Test Maker',
        description: 'A lovely vase'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.name).toBe('Test Vase');
    expect(res.body.data).toHaveProperty('id');
  });

  it('returns 400 when required fields missing', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Incomplete' });
    expect(res.statusCode).toBe(400);
  });
});

describe('PUT /api/products/:id', () => {
  it('updates an existing product', async () => {
    const res = await request(app)
      .put('/api/products/1')
      .send({ price: 55 });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.price).toBe(55);
  });

  it('returns 404 for non-existent product', async () => {
    const res = await request(app)
      .put('/api/products/99999')
      .send({ price: 10 });
    expect(res.statusCode).toBe(404);
  });
});

describe('DELETE /api/products/:id', () => {
  it('deletes a product', async () => {
    // First create one to delete
    const created = await request(app)
      .post('/api/products')
      .send({ name: 'To Delete', price: 10, category: 'Kitchen', artisan: 'Someone' });
    const id = created.body.data.id;

    const res = await request(app).delete(`/api/products/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Product deleted successfully');

    // Confirm gone
    const check = await request(app).get(`/api/products/${id}`);
    expect(check.statusCode).toBe(404);
  });

  it('returns 404 for non-existent product', async () => {
    const res = await request(app).delete('/api/products/99999');
    expect(res.statusCode).toBe(404);
  });
});

describe('POST /api/orders', () => {
  it('returns 400 with no body', async () => {
    const res = await request(app).post('/api/orders').send({});
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 with empty items', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ email: 'test@test.com', items: [] });
    expect(res.statusCode).toBe(400);
  });

  it('returns 404 for non-existent product in order', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ email: 'test@test.com', items: [{ productId: 99999, quantity: 1 }] });
    expect(res.statusCode).toBe(404);
  });

  it('creates a valid order', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ email: 'buyer@test.com', items: [{ productId: 2, quantity: 1 }] });
    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.email).toBe('buyer@test.com');
    expect(res.body.data.status).toBe('confirmed');
  });
});

describe('GET /api/orders/:id', () => {
  it('returns 404 for non-existent order', async () => {
    const res = await request(app).get('/api/orders/99999');
    expect(res.statusCode).toBe(404);
  });
});

describe('404 handler', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.statusCode).toBe(404);
  });
});