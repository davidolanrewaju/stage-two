import request from 'supertest';
import app from '../server/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    // Clean up the database
    await prisma.userOrganisation.deleteMany();
    await prisma.user.deleteMany();
    await prisma.organisation.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /auth/register', () => {
    it('Should register user successfully with default organisation', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.user.firstName).toBe('John');
      expect(response.body.data.user.email).toBe('john.doe@example.com');
      expect(response.body.data.user).toHaveProperty('userId');
      expect(response.body.data).toHaveProperty('accessToken');
    }, 20000);

    it('Should fail if required fields are missing', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Jane'
          // Missing lastName, email, password
        });

      expect(response.status).toBe(422);
      const errorMessages = response.body.errors.map(error => error.message);
      expect(errorMessages).toContain('Last name is required');
      expect(errorMessages).toContain('Enter a valid email address');
      expect(errorMessages).toContain('Password must be at least 6 characters long');
    }, 20000);

    it('Should fail if there is a duplicate email', async () => {
      await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@example.com',
          password: 'password123'
        });

      const response = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(422);
      const errorMessages = response.body.errors.map(error => error.message);
      expect(errorMessages).toContain('Email already exists');
    }, 30000);
  });

  describe('POST /auth/login', () => {
    it('Should log the user in successfully', async () => {
      await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@example.com',
          password: 'password123'
        });

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'jane.doe@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.user.email).toBe('jane.doe@example.com');
      expect(response.body.data.user).toHaveProperty('userId');
      expect(response.body.data).toHaveProperty('accessToken');
    }, 20000);

    it('Should fail if credentials are invalid', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'jane.doe@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      const errorMessages = response.body.errors.map(error => error.message);
      expect(errorMessages).toContain('Invalid password');
    }, 20000);
  });
});
