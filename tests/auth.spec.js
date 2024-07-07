import request from "supertest";
import "index.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.user.deleteMany();
  await prisma.organisation.deleteMany();
});

describe('Auth Endpoints', () => {
  it('should register a user successfully with default organisation', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        phone: '1234567890',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.user.firstName).toBe('John');
    expect(res.body.data.user.email).toBe('john.doe@example.com');
  });

  it('should log in user successfully', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'john.doe@example.com',
        password: 'password',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.user.firstName).toBe('John');
    expect(res.body.data.user.email).toBe('john.doe@example.com');
  });

  it('should fail if required fields are missing', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      });

    expect(res.statusCode).toEqual(422);
    expect(res.body.errors).toBeDefined();
  });

  it('should fail if there is a duplicate email', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: 'password',
        phone: '1234567890',
      });

    const res = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: 'password',
        phone: '1234567890',
      });

    expect(res.statusCode).toEqual(422);
    expect(res.body.errors).toBeDefined();
  });
});
