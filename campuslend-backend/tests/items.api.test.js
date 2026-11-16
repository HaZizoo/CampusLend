process.env.NODE_ENV = 'test';

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../dist/app').default;

jest.setTimeout(30000);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

const item = {
  title: 'Graphing Calculator',
  description: 'A working calculator for statistics.',
  category: 'Electronics',
  ownerEmail: 'owner@example.edu',
  maxBorrowTime: '3 days',
};

describe('items API', () => {
  it('creates a valid item and strips unknown fields', async () => {
    const response = await request(app).post('/api/items').send({ ...item, ignored: true });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ ...item, status: 'available' });
    expect(response.body).not.toHaveProperty('ignored');
  });

  it('returns Zod validation issues for an invalid item', async () => {
    const response = await request(app).post('/api/items').send({ ...item, title: 'x' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation failed');
    expect(response.body.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: ['title'] })]),
    );
  });

  it('rejects an item update without a JWT', async () => {
    const response = await request(app).put('/api/items/507f1f77bcf86cd799439011').send({ title: 'Updated item' });

    expect(response.status).toBe(401);
  });
});
