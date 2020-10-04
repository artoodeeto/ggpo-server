import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { AppServer } from '../../config/server';
import { GameGroup } from '../../src/models/gameGroup';
import { testSetup } from '../../config/test_setup';
import { UsersGameGroup } from '../../src/models/usersGameGroup';

const server = new AppServer();
const { appInstance } = server;
const rekwest = request(appInstance);

describe('GameGroup controllers', () => {
  let connection: Connection;
  let ACTIVE_JWT: string;
  let createGG: Function;
  const userInfo = {
    username: 'test',
    email: 'foobar@gmail.com',
    password: 'Password123!'
  };
  const EXPIRED_HEADER =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJub2NhcEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6Im5vY2FwIiwiaWF0IjoxNTgwODc0OTMxLCJleHAiOjE1ODA4ODU3MzF9.-f9zq8LdOwdCuwZkS_T1oyFOoxIVJ5lSv5zWHClOiUs';

  beforeEach(async () => {
    connection = await createConnection(testSetup);
    const res = await rekwest.post('/api/v1/signup').send({ ...userInfo });
    ACTIVE_JWT = res.body.payload.token;
    createGG = (): Promise<any> => {
      return rekwest
        .post('/api/v1/game_groups')
        .send({ title: 'game1', description: 'dearest father, closest friend, most beautiful' })
        .set('Authorization', `Bearer ${ACTIVE_JWT}`);
    };
  });

  afterEach(async () => {
    connection.close();
  });

  describe('POST: createGameGroup, /game_groups route', () => {
    test('should success response on creating a GameGroup', async () => {
      const res = await rekwest
        .post('/api/v1/game_groups')
        .send({ title: 'game1', description: 'the description of the game' })
        .set('Authorization', `Bearer ${ACTIVE_JWT}`);
      expect(res.status).toBe(201);
    });

    test('should fail if unauthorized', async () => {
      const res = await rekwest
        .post('/api/v1/game_groups')
        .send({ title: 'aswd' })
        .set('Authorization', `Bearer ${EXPIRED_HEADER}`);
      expect(res.status).toBe(401);
    });

    test('should fail if given empty data', async () => {
      const res = await rekwest
        .post('/api/v1/game_groups')
        .send({ title: '', description: '' })
        .set('Authorization', `Bearer ${ACTIVE_JWT}`);
      expect(res.status).toBe(400);
      expect(res.body).toContainKey('errorMessage');
      expect(res.body.errorMessage.isNotEmpty).toBe('description should not be empty');
    });

    test('should have keys', async () => {
      const res = await rekwest
        .post('/api/v1/game_groups')
        .send({ title: 'aswd', description: 'waasdfasdfasdfasfs' })
        .set('Authorization', `Bearer ${ACTIVE_JWT}`);
      expect(res.body.meta).toContainAllKeys(['createdAt']);
      expect(res.body.payload.gameGroup).toContainAllKeys(['id', 'title', 'description']);
    });
  });

  describe('GET: readGameGroup, /game_groups route/:id', () => {
    test('should success getting a GameGroup', async () => {
      const gg = await createGG();
      const res = await rekwest
        .get(`/api/v1/game_groups/${gg.body.payload.gameGroup.id}`)
        .set('Authorization', `Bearer ${ACTIVE_JWT}`);
      expect(res.status).toBe(200);
    });

    test('should fail if unauthorized', async () => {
      const gg = await createGG();
      const res = await rekwest
        .get(`/api/v1/game_groups/${gg.body.payload.gameGroup.id}`)
        .set('Authorization', `Bearer ${EXPIRED_HEADER}`);
      expect(res.status).toBe(401);
    });

    test('should return 404 if no GameGroup found', async () => {
      const res = await rekwest.get('/api/v1/game_groups/123123').set('Authorization', `Bearer ${ACTIVE_JWT}`);
      expect(res.status).toBe(404);
    });

    test('should get false since user is not following this GameGroup', async () => {
      const gg = await createGG();
      const res = await rekwest
        .get(`/api/v1/game_groups/${gg.body.payload.gameGroup.id}`)
        .set('Authorization', `Bearer ${ACTIVE_JWT}`);
      expect(res.body.payload.isFollower).toBe(false);
    });

    test('should get false since user is not following this GameGroup', async () => {
      const gg = await createGG();
      const res = await rekwest
        .get(`/api/v1/game_groups/${gg.body.payload.gameGroup.id}`)
        .set('Authorization', `Bearer ${ACTIVE_JWT}`);
      expect(res.body.payload.isFollower).toBe(false);
      expect(res.body.payload).toContainAllKeys(['isFollower', 'gameGroup']);
      expect(res.body.payload.gameGroup).toContainAllKeys([
        'id',
        'title',
        'description',
        'createdAt',
        'usersGameGroups'
      ]);
      expect(res.body.payload.gameGroup.usersGameGroups).toBeArray();
      expect(res.body.payload.gameGroup.usersGameGroups).toBeArrayOfSize(0);
    });

    test('should return these json keys if user is following', async () => {
      const gg = await createGG();
      await rekwest
        .put(`/api/v1/game_groups/follow/${gg.body.payload.gameGroup.id}`)
        .set('Authorization', `Bearer ${ACTIVE_JWT}`);

      const res = await rekwest
        .get(`/api/v1/game_groups/${gg.body.payload.gameGroup.id}`)
        .set('Authorization', `Bearer ${ACTIVE_JWT}`);
      expect(res.body.payload.isFollower).toBe(true);
      expect(res.body.payload).toContainAllKeys(['isFollower', 'gameGroup']);
      expect(res.body.payload.gameGroup).toContainAllKeys([
        'id',
        'title',
        'description',
        'createdAt',
        'usersGameGroups'
      ]);
      expect(res.body.payload.gameGroup.usersGameGroups).toBeArray();
      expect(res.body.payload.gameGroup.usersGameGroups[0].user).toContainAllKeys(['id', 'username', 'email']);
    });
  });

  describe('PUT: updateGameGroup, /game_groups/:id route', () => {
    test('should fail if unauthorized', async () => {
      const gg = await createGG();
      const res = await rekwest
        .put(`/api/v1/game_groups/${gg.body.payload.gameGroup.id}`)
        .set('Authorization', `Bearer ${EXPIRED_HEADER}`);
      expect(res.status).toBe(401);
    });

    test('should return status 404 if no ID is found', async () => {
      const res = await rekwest.put('/api/v1/game_groups/123123').set('Authorization', `Bearer ${ACTIVE_JWT}`);
      expect(res.status).toBe(404);
    });

    test('should update a GameGroup', async () => {
      const gg = await createGG();
      const res = await rekwest
        .put(`/api/v1/game_groups/${gg.body.payload.gameGroup.id}`)
        .send({ title: 'updateddddd' })
        .set('Authorization', `Bearer ${ACTIVE_JWT}`);
      expect(res.status).toBe(201);
      expect(res.body.payload.gameGroup.title).toBe('updateddddd');
      expect(res.body.payload.gameGroup).toContainAllKeys(['id', 'title', 'description']);
    });

    test('should fail if properties is/are empty', async () => {
      const gg = await createGG();
      const res = await rekwest
        .put(`/api/v1/game_groups/${gg.body.payload.gameGroup.id}`)
        .send({ title: '' })
        .set('Authorization', `Bearer ${ACTIVE_JWT}`);
      expect(res.status).toBe(400);
    });
  });

  describe('DELETE: deleteGameGroup, /game_groups/:id route', () => {
    test('should reduced count of GameGroup', async () => {
      const gg = await createGG();
      const res = await rekwest
        .delete(`/api/v1/game_groups/${gg.body.payload.gameGroup.id}`)
        .set('Authorization', `Bearer ${ACTIVE_JWT}`);

      const ggCount = await GameGroup.count();
      expect(res.status).toBe(204);
      expect(ggCount).toBe(0);
    });

    test('should return status 404 if no ID is found', async () => {
      const res = await rekwest.delete('/api/v1/game_groups/123123').set('Authorization', `Bearer ${ACTIVE_JWT}`);
      expect(res.status).toBe(404);
    });
  });

  describe('PUT: followGameGroup, /game_groups/follow/:id route', () => {
    test('should follow a GameGroup', async () => {
      const gg = await createGG();
      const res = await rekwest
        .put(`/api/v1/game_groups/follow/${gg.body.payload.gameGroup.id}`)
        .set('Authorization', `Bearer ${ACTIVE_JWT}`);

      expect(res.status).toBe(204);
    });

    test('should return status 404 if no ID is found', async () => {
      const gg = await createGG();
      const res = await rekwest
        .put(`/api/v1/game_groups/follow/${gg.body.payload.gameGroup.id}`)
        .set('Authorization', `Bearer ${EXPIRED_HEADER}`);
      expect(res.status).toBe(401);
    });
  });

  describe('DELETE: unFollowGameGroup, /game_groups/unfollow/:id route', () => {
    test('should unfollow a GameGroup', async () => {
      const gg = await createGG();
      await rekwest
        .put(`/api/v1/game_groups/follow/${gg.body.payload.gameGroup.id}`)
        .set('Authorization', `Bearer ${ACTIVE_JWT}`);

      const res = await rekwest
        .delete(`/api/v1/game_groups/unfollow/${gg.body.payload.gameGroup.id}`)
        .set('Authorization', `Bearer ${ACTIVE_JWT}`);

      const uggCount = await UsersGameGroup.count();
      expect(res.status).toBe(204);
      expect(uggCount).toBe(0);
    });

    test('should return status 401 if unauthorized', async () => {
      const gg = await createGG();
      const res = await rekwest
        .delete(`/api/v1/game_groups/unfollow/${gg.body.payload.gameGroup.id}`)
        .set('Authorization', `Bearer ${EXPIRED_HEADER}`);
      expect(res.status).toBe(401);
    });
  });

  describe('GET: getSomeGameGroup, query/some/game_groups route', () => {
    test('should return a offset, limit, and count', async () => {
      await createGG();
      await createGG();
      await createGG();
      await createGG();
      await createGG();
      const res = await rekwest
        .get(`/api/v1/game_groups/query/some/game_groups?offset=2&limit=5`)
        .set('Authorization', `Bearer ${ACTIVE_JWT}`);

      expect(res.status).toBe(200);
      expect(res.body.meta.count).toBe(5);
      // created 5 GG and offset by 2 should return 3
      expect(res.body.payload.gameGroups).toBeArrayOfSize(3);
      expect(res.body.payload.gameGroups[0]).toContainAllKeys(['id', 'title', 'description', 'createdAt', 'updatedAt']);
    });

    test('should return status 401 if unauthorized', async () => {
      const gg = await createGG();
      const res = await rekwest
        .delete(`/api/v1/game_groups/unfollow/${gg.body.payload.gameGroup.id}`)
        .set('Authorization', `Bearer ${EXPIRED_HEADER}`);
      expect(res.status).toBe(401);
    });
  });
});
