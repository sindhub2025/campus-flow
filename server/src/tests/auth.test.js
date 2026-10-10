const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../app');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');

test.before(async () => {
  await connectDB();
});

test.after(async () => {
  await disconnectDB();
});

test.beforeEach(async () => {
  await User.deleteMany({});
});

test('Auth API registers a user', async () => {
  const response = await request(app).post('/api/auth/register').send({
    name: 'Test User',
    email: 'user@example.com',
    password: 'secret123',
    passwordConfirm: 'secret123',
  });

  assert.equal(response.status, 201);
  assert.equal(response.body.user.email, 'user@example.com');
});

test('Auth API rejects unauthenticated access to protected routes', async () => {
  const response = await request(app).get('/api/tasks');
  assert.equal(response.status, 401);
});
