const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');

describe('Export API', () => {
  let token;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await request(app)
      .post('/auth/register')
      .send({ email: 'export@example.com', password: 'password123' });
    const login = await request(app)
      .post('/auth/login')
      .send({ email: 'export@example.com', password: 'password123' });
    token = login.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should request data export', async () => {
    const res = await request(app)
      .post('/export/request')
      .set('Authorization', `Bearer ${token}`)
      .send({ excludedCategories: ['settings'] });
    expect(res.status).toBe(201);
    expect(res.body.requestId).toBeDefined();
  });
});