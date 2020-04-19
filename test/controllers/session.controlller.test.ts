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
    password: 'Password123!'
  };

  beforeEach(async () => {
    connection = await createConnection(testSetup);
  });

  afterEach(async () => {
    connection.close();
  });

  describe('POST: /signup route', () => {
    describe('ON SIGNUP', () => {
      test('signup should be successful', async () => {
        const res = await rekwest.post('/api/v1/signup').send({ ...userInfo });
        expect(res.status).toBe(200);
        expect(res.body).toContainKeys(['meta', 'payload']);
        expect(res.body.meta).toContainKeys(['issueDate', 'expToken']);
        expect(res.body.payload).toContainKeys(['token', 'user']);
        expect(res.body.payload.user).toContainKeys(['id', 'email', 'username']);
      });

      test('duplicate email on signup should fail', async () => {
        await User.create({ ...userInfo }).save();
        const res = await rekwest.post('/api/v1/signup').send({ ...userInfo });
        expect(res.status).toBe(400);
      });

      test('signup should have expiry of 3h max', async () => {
        const res = await rekwest.post('/api/v1/signup').send({ ...userInfo });
        const exp = Number(res.body.meta.expToken);
        expect(exp / 1000 / 60 / 60).toEqual(3);
      });
    });

    describe('USERNAME', () => {
      test('empty username on signup should fail', async () => {
        const u = {
          username: '',
          email: 'foobar@gmail.com',
          password: 'Password123!'
        };
        const res = await rekwest.post('/api/v1/signup').send({ ...u });
        expect(res.status).toBe(400);
      });
    });

    describe('EMAIL', () => {
      test('empty email on signup should fail if empty', async () => {
        const u = {
          username: 'test',
          email: '',
          password: 'Password123!'
        };
        const res = await rekwest.post('/api/v1/signup').send({ ...u });
        expect(res.status).toBe(400);
      });

      test('on signup should fail if incorrect format', async () => {
        const u = {
          username: 'test',
          email: 'email',
          password: 'Password123!'
        };
        const res = await rekwest.post('/api/v1/signup').send({ ...u });
        expect(res.status).toBe(400);
      });
    });

    describe('PASSWORD', () => {
      test('empty password on signup should fail', async () => {
        const u = {
          username: 'test',
          email: 'foobar@gmail.com',
          password: ''
        };
        const res = await rekwest.post('/api/v1/signup').send({ ...u });
        expect(res.status).toBe(400);
        expect(res.body.error[0].constraints).toContainKey('isNotEmpty');
        expect(res.body.error[0].constraints.isNotEmpty).toMatch('password should not be empty');
      });

      test('password with less than 8 should fail', async () => {
        const u = {
          username: 'test',
          email: 'foobar@gmail.com',
          password: 'Pass'
        };
        const res = await rekwest.post('/api/v1/signup').send({ ...u });
        expect(res.status).toBe(400);
        expect(res.body.error[0].constraints).toContainKey('minLength');
        expect(res.body.error[0].constraints.minLength).toMatch(
          'password must be longer than or equal to 8 characters'
        );
      });

      test('password should have at least one !@#$%^&', async () => {
        const u = {
          username: 'test',
          email: 'foobar@gmail.com',
          password: 'Password123'
        };
        const res = await rekwest.post('/api/v1/signup').send({ ...u });
        expect(res.status).toBe(400);
        expect(res.body.error[0].constraints).toContainKey('matches');
        expect(res.body.error[0].constraints.matches).toMatch('password must match /[!@#$%^&]/ regular expression');
      });

      test('password should have at least one A-Z', async () => {
        const u = {
          username: 'test',
          email: 'foobar@gmail.com',
          password: 'password!1'
        };
        const res = await rekwest.post('/api/v1/signup').send({ ...u });
        expect(res.status).toBe(400);
        expect(res.body.error[0].constraints).toContainKey('matches');
        expect(res.body.error[0].constraints.matches).toMatch('password must match /[A-Z]/ regular expression');
      });

      test('password should have at least one 0-9', async () => {
        const u = {
          username: 'test',
          email: 'foobar@gmail.com',
          password: 'Password!'
        };
        const res = await rekwest.post('/api/v1/signup').send({ ...u });
        expect(res.status).toBe(400);
        expect(res.body.error[0].constraints).toContainKey('matches');
        expect(res.body.error[0].constraints.matches).toMatch('password must match /[0-9]/ regular expression');
      });
    });
  });

  describe('POST: /login route', () => {
    test('signup should be successful', async () => {
      await User.create({ ...userInfo }).save();
      const res = await rekwest.post('/api/v1/login').send({ ...userInfo });
      expect(res.status).toBe(200);
    });

    test('success login should contain these keys', async () => {
      await User.create({ ...userInfo }).save();
      const res = await rekwest.post('/api/v1/login').send({ ...userInfo });
      expect(res.body).toContainKeys(['meta', 'payload']);
      expect(res.body.meta).toContainKeys(['issueDate', 'expToken']);
      expect(res.body.payload).toContainKeys(['user', 'token']);
      expect(res.body.payload.user).toContainKeys(['id', 'email', 'username']);
    });

    test('unsuccessful login: user not registered or incorrect email', async () => {
      const login = {
        username: 'test',
        email: 'foobarbaz@gmail.com',
        password: 'Password123!'
      };
      const res = await rekwest.post('/api/v1/login').send({ ...login });
      expect(res.status).toBe(404);
      expect(res.body).toContainKey('error');
      expect(res.body.error).toMatch(`no user with ${login.email}`);
    });

    test('unsuccessful login: Incorrect password', async () => {
      const login = {
        username: 'test',
        email: 'foobarbaz@gmail.com',
        password: 'Password123!'
      };
      await User.create({ ...login }).save();
      const res = await rekwest.post('/api/v1/login').send({ ...login, password: 'wawa' });
      expect(res.status).toBe(400);
      expect(res.body).toContainKey('error');
      expect(res.body.error).toMatch('incorrect credentials');
    });

    test('login should have expiry of 3h max', async () => {
      await User.create({ ...userInfo }).save();
      const res = await rekwest.post('/api/v1/login').send({ ...userInfo });
      const exp = Number(res.body.meta.expToken);
      expect(exp / 1000 / 60 / 60).toEqual(3);
    });
  });
});
