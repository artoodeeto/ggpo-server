import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { AppServer } from '../../config/server';
import { User } from '../../src/models/user_model';
import ormConfig from '../../ormconfig';

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

  beforeEach(async () => {
    connection = await createConnection(ormConfig);
  });

  afterEach(async () => {
    connection.close();
  });

  describe('POST: /users/signup route', () => {
    test('signup should be successful', async () => {
      const res = await rekwest.post('/api/v1/users/signup').send({ ...userInfo });
      expect(res.status).toBe(200);
      expect(res.body).toContainKeys(['meta', 'payload']);
      expect(res.body.payload).toContainKeys(['token', 'user']);
      expect(res.body.payload.user).toContainKeys(['id', 'email', 'username']);
    });

    test('duplicate email on signup should fail', async () => {
      await User.create({ ...userInfo }).save();
      const res = await rekwest.post('/api/v1/users/signup').send({ ...userInfo });
      expect(res.status).toBe(400);
    });

    test('empty email on signup should fail', async () => {
      const u = {
        username: 'test',
        email: '',
        password: 'password'
      };
      const res = await rekwest.post('/api/v1/users/signup').send({ ...u });
      expect(res.status).toBe(400);
    });

    test('empty username on signup should fail', async () => {
      const u = {
        username: '',
        email: 'foobar@gmail.com',
        password: 'password'
      };
      const res = await rekwest.post('/api/v1/users/signup').send({ ...u });
      expect(res.status).toBe(400);
    });

    test('empty password on signup should fail', async () => {
      const u = {
        username: 'test',
        email: 'foobar@gmail.com',
        password: ''
      };
      const res = await rekwest.post('/api/v1/users/signup').send({ ...u });
      expect(res.status).toBe(400);
    });
  });

  describe('POST: /users/login route', () => {
    test('signup should be successful', async () => {
      await User.create({ ...userInfo }).save();
      const res = await rekwest.post('/api/v1/users/login').send({ ...userInfo });
      expect(res.status).toBe(200);
    });

    test('success login should contain these keys', async () => {
      await User.create({ ...userInfo }).save();
      const res = await rekwest.post('/api/v1/users/login').send({ ...userInfo });
      expect(res.body).toContainKeys(['meta', 'payload']);
      expect(res.body.payload).toContainKeys(['user', 'token']);
      expect(res.body.payload.user).toContainKeys(['id', 'email', 'username']);
    });

    test('unsuccessful login: user not registered or incorrect email', async () => {
      const login = {
        username: 'test',
        email: 'foobarbaz@gmail.com',
        password: 'password'
      };
      const res = await rekwest.post('/api/v1/users/login').send({ ...login });
      expect(res.status).toBe(404);
      expect(res.body).toContainKey('error');
      expect(res.body.error).toMatch(`no user with ${login.email}`);
    });

    test('unsuccessful login: Incorrect password', async () => {
      const login = {
        username: 'test',
        email: 'foobarbaz@gmail.com',
        password: 'password'
      };
      await User.create({ ...login }).save();
      const res = await rekwest.post('/api/v1/users/login').send({ ...login, password: 'wawa' });
      expect(res.status).toBe(400);
      expect(res.body).toContainKey('error');
      expect(res.body.error).toMatch('incorrect credentials');
    });
  });

  /**
   * since this is a protected route,
   * let the user login first to get a token
   * then use Authorization header to get requested data
   */
  describe('GET: /users route', () => {
    test('should return status code 200', async () => {
      await User.create({ ...userInfo }).save();
      const loginResponse = await rekwest.post('/api/v1/users/login').send({ ...userInfo });
      const { token } = loginResponse.body.payload;
      const res = await rekwest.get('/api/v1/users?offset=2').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
    });

    test('should return an Array of users, with valid keys', async () => {
      await User.create({ ...userInfo }).save();
      const loginResponse = await rekwest.post('/api/v1/users/login').send({ ...userInfo });
      const { token } = loginResponse.body.payload;
      const res = await rekwest.get('/api/v1/users?offset=2').set('Authorization', `Bearer ${token}`);
      expect(res.body.payload.users).toBeArray();
      expect(res.body).toContainKeys(['meta', 'payload']);
      expect(res.body.payload).toContainKey('users');
    });

    test('should return a content type of application/json', async (done) => {
      await User.create({ ...userInfo }).save();
      const loginResponse = await rekwest.post('/api/v1/users/login').send({ ...userInfo });
      const { token } = loginResponse.body.payload;
      rekwest
        .get('/api/v1/users/')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .end(done);
    });
  });

  describe('GET: /users/:id route', () => {
    test('should return status code 200 with payload', async () => {
      await User.create({ ...userInfo }).save();
      const loginResponse = await rekwest.post('/api/v1/users/login').send({ ...userInfo });
      const { token } = loginResponse.body.payload;
      const res = await rekwest.get('/api/v1/users/1').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toContainKeys(['meta', 'payload']);
      expect(res.body.payload).toContainKeys(['username', 'email']);
    });

    test('should return status code 400 with error information', async () => {
      await User.create({ ...userInfo }).save();
      const loginResponse = await rekwest.post('/api/v1/users/login').send({ ...userInfo });
      const { token } = loginResponse.body.payload;
      const res = await rekwest.get('/api/v1/users/100').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
      expect(res.body).toContainKey('error');
      expect(res.body.error).toContainKeys(['name', 'message']);
    });
  });
});
