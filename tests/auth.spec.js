import request from "supertest";
import app from "../server/app.js"

describe('Auth Endpoints', () => {
  it('should register a user successfully with default organisation', async () => {
    jest.setTimeout(60000);
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
    expect(res.body.status).toBe('success');
    expect(res.body.data.user.firstName).toBe('John');
    expect(res.body.data.user.email).toBe('john.doe@example.com');
    expect(res.body.data.user).toHaveProperty('userId');
    expect(res.body.data.accessToken).toBeDefined();

    // Verify the default organisation name
    const orgRes = await request(app)
      .get('/api/organisations')
      .set('Authorization', `Bearer ${res.body.data.accessToken}`);

    expect(orgRes.statusCode).toEqual(200);
    expect(orgRes.body.data.organisations[0].name).toBe("John's Organisation");
  });

  it('should log in user successfully', async () => {
    jest.setTimeout(60000);
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'john.doe@example.com',
        password: 'password',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.user.firstName).toBe('John');
    expect(res.body.data.user.email).toBe('john.doe@example.com');
    expect(res.body.data.user).toHaveProperty('userId');
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('should fail if required fields are missing', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        firstName: '',
        lastName: 'Doe',
        email: 'john.doe2@example.com',
        password: 'password',
        phone: '1234567890',
      });

    expect(res.statusCode).toEqual(422);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'firstName' }),
      ])
    );

    const res2 = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'Jane',
        lastName: '',
        email: 'jane.doe@example.com',
        password: 'password',
        phone: '1234567890',
      });

    expect(res2.statusCode).toEqual(422);
    expect(res2.body.errors).toBeDefined();
    expect(res2.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'lastName' }),
      ])
    );

    const res3 = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: '',
        password: 'password',
        phone: '1234567890',
      });

    expect(res3.statusCode).toEqual(422);
    expect(res3.body.errors).toBeDefined();
    expect(res3.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'email' }),
      ])
    );

    const res4 = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: '',
        phone: '1234567890',
      });

    expect(res4.statusCode).toEqual(422);
    expect(res4.body.errors).toBeDefined();
    expect(res4.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'password' }),
      ])
    );
  });

  it('should fail if there is a duplicate email', async () => {
    jest.setTimeout(60000);
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
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'email', message: 'Email must be unique' }),
      ])
    );
  });
});