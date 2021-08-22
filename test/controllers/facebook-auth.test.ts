import { Response } from 'express';
import request from 'supertest';
import { Connection, createConnection, QueryFailedError } from 'typeorm';
import { AppServer } from '../../config/server';
import { testSetup } from '../../config/test_setup';
import { User } from '../../src/models/user';
import { PassportAuthController } from '../../src/controllers/passport-auth_controller';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { FacebookAuthError } from '../../src/errors/facebookAuthError';
import { facebookPassportOptions } from '../../config/passportAuthOptions';

const server = new AppServer();
const { appInstance } = server;
const rekwest = request(appInstance);

// jest.mock('../../src/controllers/facebook-auth_controller.ts');
// const mockFb = PassportAuthController as jest.Mocked<typeof PassportAuthController>;
// jest.mock('passport');
// const mockedPassport = passport as jest.Mocked<typeof passport>;

describe('FacebookAuth controllers', () => {
  let connection: Connection;
  const userInfo = {
    id: 12,
    username: 'test',
    email: 'foobar@gmail.com',
    password: 'Password123!'
  };
  let user: User;
  let token: string;
  const EXPIRED_HEADER =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJub2NhcEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6Im5vY2FwIiwiaWF0IjoxNTgwODc0OTMxLCJleHAiOjE1ODA4ODU3MzF9.-f9zq8LdOwdCuwZkS_T1oyFOoxIVJ5lSv5zWHClOiUs';

  beforeEach(async () => {
    connection = await createConnection(testSetup);
    user = User.create({ ...userInfo });
    user.generateJWToken();
    token = user.token;
  });

  afterEach(async () => {
    connection.close();
  });

  afterAll(async () => {
    // remove jest open handle warning
    // https://stackoverflow.com/a/66625326/7034540
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
  });

  describe('GET: /auth/facebook', () => {
    test('should redirect to facebook dialog', async () => {
      let res = await rekwest
        .get('/api/v1/auth/facebook')
        .expect('Location', /\https:\/\/www.facebook.com\/v3.2\/dialog\/oauth/gi);
      expect(res.status).toBe(302);
    });
  });

  describe('GET: /auth/failed-redirect', () => {
    test('should redirect to failed-redirect', async () => {
      let res = await rekwest
        .get('/api/v1/auth/failed-redirect')
        .expect('Location', `${process.env.FRONTEND_BASE_URL}`);
      expect(res.status).toBe(302);
    });
  });

  describe('GET: /auth/user', () => {
    test('should return user', async () => {
      let res = await rekwest.get('/api/v1/auth/user').set('Authorization', `Bearer ${token}`);
      expect(res.body).toContainAllKeys(['meta', 'payload']);
      expect(res.body.meta).toContainAllKeys(['issueDate', 'expToken']);
      expect(res.body.payload).toContainAllKeys(['user']);
      expect(res.body.payload.user).toContainAllKeys(['id', 'username', 'email']);
      expect(res.status).toBe(200);
    });
  });

  describe('GET: /auth/user', () => {
    test('should response UNAUTHORIZED', async () => {
      let res = await rekwest.get('/api/v1/auth/user').set('Authorization', `Bearer ${EXPIRED_HEADER}`);
      expect(res.status).toBe(401);
    });
  });

  describe('PASSPORT', () => {
    test.todo('TEST MOCK PASSPORT');
  });
});
