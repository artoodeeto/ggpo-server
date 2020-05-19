import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { AppServer } from '../../config/server';
import { User } from '../../src/models/user';
import { testSetup } from '../../config/test_setup';

const server = new AppServer();
const { appInstance } = server;
const rekwest = request(appInstance);

describe('Sessions controllers', () => {
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
        expect(res.status).toBe(201);
        expect(res.body).toContainKeys(['meta', 'payload']);
        expect(res.body.meta).toContainKeys(['issueDate', 'expToken']);
        expect(res.body.payload).toContainKeys(['token', 'user']);
        expect(res.body.payload.user).toContainKeys(['id', 'email', 'username']);
      });

      // test('duplicate email on signup should fail', async () => {
      //   await User.create({ ...userInfo }).save();
      //   const res = await rekwest.post('/api/v1/signup').send({ ...userInfo });
      //   expect(res.status).toBe(400);
      //   expect(res.body.errorMessage).toMatch(/Duplicate entry/);
      // });

      // test('validation on signup should fail if constraints are not met', async () => {
      //   await User.create({
      //     username: '',
      //     email: 'new1@gmail',
      //     password: ''
      //   }).save();
      //   const res = await rekwest.post('/api/v1/signup').send({ ...userInfo });
      //   expect(res.status).toBe(400);
      //   expect(res.body.errorMessage.isNotEmpty).toBe('username should not be empty');
      //   expect(res.body.errorMessage.isEmail).toBe('email must be an email');
      //   expect(res.body.errorMessage.minLength).toBe('password must be longer than or equal to 8 characters');
      //   expect(res.body.errorMessage.matches).toBe('password must match /[0-9]/ regular expression');
      // });

      // test('validation on signup should fail if password has no special characters', async () => {
      //   await User.create({
      //     username: 'new1',
      //     email: 'new1@gmail.com',
      //     password: 'Password1'
      //   }).save();
      //   const res = await rekwest.post('/api/v1/signup').send({ ...userInfo });
      //   expect(res.status).toBe(400);
      //   expect(res.body.errorMessage.matches).toBe('password must match /[!@#$%^&]/ regular expression');
      // });

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
        expect(res.body.errorMessage.isNotEmpty).toBe('username should not be empty');
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
        expect(res.body.errorMessage.isEmail).toBe('email must be an email');
        expect(res.body.errorMessage.isNotEmpty).toBe('email should not be empty');
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
        expect(res.body.errorMessage).toContainKey('isNotEmpty');
        expect(res.body.errorMessage.isNotEmpty).toBe('password should not be empty');
      });

      test('password with less than 8 should fail', async () => {
        const u = {
          username: 'test',
          email: 'foobar@gmail.com',
          password: 'Pass'
        };
        const res = await rekwest.post('/api/v1/signup').send({ ...u });
        expect(res.status).toBe(400);
        expect(res.body.errorMessage).toContainKey('minLength');
        expect(res.body.errorMessage.minLength).toMatch('password must be longer than or equal to 8 characters');
      });

      test('password should have at least one !@#$%^&', async () => {
        const u = {
          username: 'test',
          email: 'foobar@gmail.com',
          password: 'Password123'
        };
        const res = await rekwest.post('/api/v1/signup').send({ ...u });
        expect(res.status).toBe(400);
        expect(res.body.errorMessage).toContainKey('matches');
        expect(res.body.errorMessage.matches).toMatch('password must match /[!@#$%^&]/ regular expression');
      });

      test('password should have at least one A-Z', async () => {
        const u = {
          username: 'test',
          email: 'foobar@gmail.com',
          password: 'password!1'
        };
        const res = await rekwest.post('/api/v1/signup').send({ ...u });
        expect(res.status).toBe(400);
        expect(res.body.errorMessage).toContainKey('matches');
        expect(res.body.errorMessage.matches).toMatch('password must match /[A-Z]/ regular expression');
      });

      test('password should have at least one 0-9', async () => {
        const u = {
          username: 'test',
          email: 'foobar@gmail.com',
          password: 'Password!'
        };
        const res = await rekwest.post('/api/v1/signup').send({ ...u });
        expect(res.status).toBe(400);
        expect(res.body.errorMessage).toContainKey('matches');
        expect(res.body.errorMessage.matches).toMatch('password must match /[0-9]/ regular expression');
      });
    });
  });

  describe('POST: /login route', () => {
    test('signup should be successful', async () => {
      await User.create({ ...userInfo }).save();
      const res = await rekwest.post('/api/v1/login').send({ ...userInfo });
      expect(res.status).toBe(201);
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
      expect(res.body).toContainKeys(['errorMessage', 'errorType']);
      expect(res.body.errorMessage).toMatch('Could not found any Entity');
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
      expect(res.body).toContainKeys(['errorMessage', 'errorType']);
      expect(res.body.errorMessage).toMatch('Password does not match the email');
    });

    test('login should have expiry of 3h max', async () => {
      await User.create({ ...userInfo }).save();
      const res = await rekwest.post('/api/v1/login').send({ ...userInfo });
      const exp = Number(res.body.meta.expToken);
      expect(exp / 1000 / 60 / 60).toEqual(3);
    });
  });
});
