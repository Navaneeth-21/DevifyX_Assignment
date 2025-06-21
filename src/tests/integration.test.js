const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const ExportRequest = require('../models/ExportRequest');
const fs = require('fs');
const path = require('path');

describe('Integration Tests: Data Export Workflow', () => {
  let token;
  let userId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    // Register and login a user
    await request(app)
      .post('/auth/register')
      .send({ email: 'integration@example.com', password: 'password123' });
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: 'integration@example.com', password: 'password123' });
    token = loginRes.body.token;
    userId = (await User.findOne({ email: 'integration@example.com' }))._id;
  });

  afterAll(async () => {
    await User.deleteMany({ email: 'integration@example.com' });
    await ExportRequest.deleteMany({ userId });
    await mongoose.connection.close();
  });

  it('should complete the data export workflow', async () => {
    // Step 1: Request export
    const requestRes = await request(app)
      .post('/export/request')
      .set('Authorization', `Bearer ${token}`)
      .send({ excludedCategories: ['settings'] });
    expect(requestRes.status).toBe(201);
    const requestId = requestRes.body.requestId;

    // Step 2: Simulate queue processing (in real app, queue would handle this)
    const exportRequest = await ExportRequest.findById(requestId);
    exportRequest.status = 'completed';
    exportRequest.downloadLink = path.join(__dirname, `../../exports/export-${requestId}.zip`);
    await exportRequest.save();

    // Step 3: Download export
    const downloadRes = await request(app)
      .get(`/export/download/${requestId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(downloadRes.status).toBe(200);
    expect(downloadRes.headers['content-type']).toMatch(/application\/zip/);
  });

  it('should prevent unauthorized download', async () => {
    const res = await request(app)
      .get('/export/download/invalid-id')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Unauthorized access');
  });
});