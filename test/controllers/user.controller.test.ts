import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { AppServer } from '../../config/server';
import { User } from '../../src/models/user';
import { testSetup } from '../../config/test_setup';

const server = new AppServer();
const { appInstance } = server;
const rekwest = request(appInstance);

describe('User controllers', () => {
  let connection: Connection;
  const userInfo = {
    username: 'test',
    email: 'foobar@gmail.com',
    password: 'password'
  };
  const EXPIRED_HEADER =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJub2NhcEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6Im5vY2FwIiwiaWF0IjoxNTgwODc0OTMxLCJleHAiOjE1ODA4ODU3MzF9.-f9zq8LdOwdCuwZkS_T1oyFOoxIVJ5lSv5zWHClOiUs';

  beforeEach(async () => {
    connection = await createConnection(testSetup);
  });

  afterEach(async () => {
    connection.close();
  });

  describe('GET: /users/:id route', () => {
    test('should return status code 200 with payload', async () => {
      await User.create({ ...userInfo }).save();
      const loginResponse = await rekwest.post('/api/v1/login').send({ ...userInfo });
      const { token } = loginResponse.body.payload;
      const res = await rekwest.get('/api/v1/users/1').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toContainKeys(['meta', 'payload']);
      expect(res.body.payload).toContainKeys(['username', 'email']);
    });

    test('should return status code 400 with error information', async () => {
      await User.create({ ...userInfo }).save();
      const loginResponse = await rekwest.post('/api/v1/login').send({ ...userInfo });
      const { token } = loginResponse.body.payload;
      const res = await rekwest.get('/api/v1/users/100').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
      expect(res.body).toContainKey('error');
      expect(res.body.error).toContainKeys(['name', 'message']);
    });

    test('should fail if no headers', async () => {
      const res = await rekwest.get('/api/v1/users/1');
      expect(res.status).toBe(401);
    });

    test('should fail if header is expired', async () => {
      const res = await rekwest.get('/api/v1/users/1').set('Authorization', `Bearer ${EXPIRED_HEADER}`);
      expect(res.status).toBe(401);
    });
  });

  describe('PUT: /users/:id route', () => {
    test('should be response success', async () => {
      await User.create({ ...userInfo }).save();
      const loginResponse = await rekwest.post('/api/v1/login').send({ ...userInfo });
      const { token, user } = loginResponse.body.payload;
      const res = await rekwest.put(`/api/v1/users/${user.id}`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
    });

    test('should return status code 404 if user Id is incorrect', async () => {
      await User.create({ ...userInfo }).save();
      const loginResponse = await rekwest.post('/api/v1/login').send({ ...userInfo });
      const { token } = loginResponse.body.payload;
      const res = await rekwest.put('/api/v1/users/123').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });

    test('should update a user', async () => {
      await User.create({ ...userInfo }).save();
      const loginResponse = await rekwest.post('/api/v1/login').send({ ...userInfo });
      const { token, user } = loginResponse.body.payload;
      const res = await rekwest
        .put(`/api/v1/users/${user.id}`)
        .send({ username: 'kwala' })
        .set('Authorization', `Bearer ${token}`);
      expect(res.body.payload.user.username).toBe('kwala');
    });

    test('should throw error if user model in invalid', async () => {
      await User.create({ ...userInfo }).save();
      const loginResponse = await rekwest.post('/api/v1/login').send({ ...userInfo });
      const { token, user } = loginResponse.body.payload;
      const res = await rekwest
        .put(`/api/v1/users/${user.id}`)
        .send({ email: 'kwala' })
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE: /users/:id route', () => {
    test('should delete a user', async () => {
      await User.create({ ...userInfo }).save();
      const loginResponse = await rekwest.post('/api/v1/login').send({ ...userInfo });
      const { token, user } = loginResponse.body.payload;
      const res = await rekwest.delete(`/api/v1/users/${user.id}`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      const userCount: number = await User.count();
      expect(userCount).toBe(0);
    });

    test('should return status code 404 if user Id is incorrect', async () => {
      await User.create({ ...userInfo }).save();
      const loginResponse = await rekwest.post('/api/v1/login').send({ ...userInfo });
      const { token } = loginResponse.body.payload;
      const res = await rekwest.delete('/api/v1/users/123').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
      const userCount: number = await User.count();
      expect(userCount).toBe(1);
    });

    test('should throw error if no header or expired', async () => {
      const res = await rekwest.delete('/api/v1/users/123');
      expect(res.status).toBe(401);
    });

    test('should throw error if no header or expired', async () => {
      const res = await rekwest.delete('/api/v1/users/123').set('Authorization', `Bearer ${EXPIRED_HEADER}`);
      expect(res.status).toBe(401);
    });
  });

  describe('GET: /query/some/users?offset={number} route', () => {
    test('should return status code 200', async () => {
      await User.create({ ...userInfo }).save();
      const loginResponse = await rekwest.post('/api/v1/login').send({ ...userInfo });
      const { token } = loginResponse.body.payload;
      const res = await rekwest.get('/api/v1/users/query/some/users?offset=2').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
    });

    test('should return an Array of users, with valid keys', async () => {
      await User.create({ ...userInfo }).save();
      const loginResponse = await rekwest.post('/api/v1/login').send({ ...userInfo });
      const { token } = loginResponse.body.payload;
      const res = await rekwest.get('/api/v1/users/query/some/users?offset=2').set('Authorization', `Bearer ${token}`);
      expect(res.body.payload.users).toBeArray();
      expect(res.body).toContainKeys(['meta', 'payload']);
      expect(res.body.payload).toContainKey('users');
    });

    test('should return a content type of application/json', async (done) => {
      await User.create({ ...userInfo }).save();
      const loginResponse = await rekwest.post('/api/v1/login').send({ ...userInfo });
      const { token } = loginResponse.body.payload;
      rekwest
        .get('/api/v1/users/query/some/users')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .end(done);
    });

    test('should fail if no headers', async () => {
      const res = await rekwest.get('/api/v1/users/query/some/users?offset=2');
      expect(res.status).toBe(401);
    });

    test('should fail if header is expired', async () => {
      const res = await rekwest
        .get('/api/v1/users/query/some/users?offset=2')
        .set('Authorization', `Bearer ${EXPIRED_HEADER}`);
      expect(res.status).toBe(401);
    });
  });
});
