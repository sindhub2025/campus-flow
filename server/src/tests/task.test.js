const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../app');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Task = require('../models/Task');

test.before(async () => {
  await connectDB();
});

test.after(async () => {
  await disconnectDB();
});

test.beforeEach(async () => {
  await User.deleteMany({});
  await Task.deleteMany({});
});

test('Task API creates and lists tasks for the authenticated user', async () => {
  const registerResponse = await request(app).post('/api/auth/register').send({
    name: 'Student',
    email: 'student@example.com',
    password: 'secret123',
    passwordConfirm: 'secret123',
  });

  assert.equal(registerResponse.status, 201);

  const loginResponse = await request(app).post('/api/auth/login').send({
    email: 'student@example.com',
    password: 'secret123',
  });

  const cookie = loginResponse.headers['set-cookie'];
  assert.ok(cookie && cookie.length > 0, 'Expected a cookie to be set after login');

  const token = cookie[0].split(';')[0].split('=')[1];
  const createResponse = await request(app)
    .post('/api/tasks')
    .set('Cookie', [`campusflow_token=${token}`])
    .send({ title: 'Build app', priority: 'high', status: 'todo' });

  assert.equal(createResponse.status, 201);
  const listResponse = await request(app)
    .get('/api/tasks')
    .set('Cookie', [`campusflow_token=${token}`]);

  assert.equal(listResponse.status, 200);
  assert.equal(listResponse.body.tasks.length, 1);
});
