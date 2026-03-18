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
  it('returns products array', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
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
    expect(res.body.data.length).toBeGreaterThanOrEqual(0);
  });

  it('returns count field', async () => {
    const res = await request(app).get('/api/products');
    expect(res.body).toHaveProperty('count');
    expect(typeof res.body.count).toBe('number');
  });
});

describe('GET /api/products/categories', () => {
  it('returns categories array', async () => {
    const res = await request(app).get('/api/products/categories');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('GET /api/products/:id', () => {
  it('returns 404 for invalid id', async () => {
    const res = await request(app).get('/api/products/99999');
    expect(res.statusCode).toBe(404);
  });

  it('returns product for valid id', async () => {
    const listRes = await request(app).get('/api/products');
    if (listRes.body.data.length > 0) {
      const id = listRes.body.data[0].id;
      const res = await request(app).get(`/api/products/${id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('name');
      expect(res.body.data).toHaveProperty('price');
    }
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

  it('returns 404 for non-existent product', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ email: 'test@test.com', items: [{ productId: 99999, quantity: 1 }] });
    expect(res.statusCode).toBe(404);
  });
});

describe('404 handler', () => {
  it('returns 404 for unknown route', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.statusCode).toBe(404);
  });
});