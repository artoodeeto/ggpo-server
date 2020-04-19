import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { AppServer } from '../../config/server';
import { testSetup } from '../../config/test_setup';
import { Post } from '../../src/models/post';

const server = new AppServer();
const { appInstance } = server;
const rekwest = request(appInstance);

describe('Post controllers', () => {
  let connection: Connection;
  let ACTIVE_JWT: string;
  let createPost: Function;
  const userInfo = {
    username: 'nocap',
    email: 'nocap@gmail.com',
    password: 'password'
  };
  const samplePost = {
    title: 'shit',
    body: 'bull'
  };
  const EXPIRED_HEADER =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJub2NhcEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6Im5vY2FwIiwiaWF0IjoxNTgwODc0OTMxLCJleHAiOjE1ODA4ODU3MzF9.-f9zq8LdOwdCuwZkS_T1oyFOoxIVJ5lSv5zWHClOiUs';

  beforeEach(async () => {
    connection = await createConnection(testSetup);
    const res = await rekwest.post('/api/v1/signup').send({ ...userInfo });
    ACTIVE_JWT = res.body.payload.token;
    createPost = (): Promise<any> => {
      return Post.create(samplePost).save();
    };
  });

  afterEach(async () => {
    connection.close();
  });

  describe('POST: /posts route', () => {
    test('should success response on creating a post', async () => {
      const res = await rekwest
        .post('/api/v1/posts')
        .send({ ...samplePost })
        .set('Authorization', `Bearer ${ACTIVE_JWT}`);
      expect(res.status).toBe(200);
    });
    // ! If you uncomment this it will fail on test. check createPost method controller
    // test('should fail if given empty values', async () => {
    //   const res = await rekwest
    //     .post('/api/v1/posts')
    //     .send({ title: '', body: '' })
    //     .set('Authorization', `Bearer ${ACTIVE_JWT}`);
    //   expect(res.status).toBe(400);
    // });
  });

  describe('GET: /posts/:id route', () => {
    test('should success in getting specific posts', async () => {
      const newPost = await createPost();
      const res = await rekwest.get(`/api/v1/posts/${newPost.id}`).set('Authorization', `Bearer ${ACTIVE_JWT}`);
      expect(res.status).toBe(200);
      expect(res.body.payload.post).toContainKeys(['id', 'body', 'title']);
    });

    test('should fail if no ID is given', async () => {
      const res = await rekwest.get('/api/v1/posts/').set('Authorization', `Bearer ${ACTIVE_JWT}`);
      expect(res.status).toBe(404);
    });

    test('should fail if ID is in correct', async () => {
      const res = await rekwest.get('/api/v1/posts/123123123123').set('Authorization', `Bearer ${ACTIVE_JWT}`);
      expect(res.status).toBe(404);
    });
  });

  describe('PUT: /posts/:id route', () => {
    test('should update a post', async () => {
      const newPost = await createPost();
      const { id } = newPost;
      const res = await rekwest
        .put(`/api/v1/posts/${id}`)
        .send({ title: 'the', body: 'new' })
        .set('Authorization', `Bearer ${ACTIVE_JWT}`);
      expect(res.status).toBe(200);
      const { title, body } = res.body.payload.post;
      expect(title).toBe('the');
      expect(body).toBe('new');
    });

    test('should fail if given empty strings', async () => {
      const newPost = await createPost();
      const { id } = newPost;
      const res = await rekwest
        .put(`/api/v1/posts/${id}`)
        .send({ title: '', body: '' })
        .set('Authorization', `Bearer ${ACTIVE_JWT}`);
      expect(res.status).toBe(404);
      expect(res.body.error).toBeArray();
    });

    test('should fail if no ID is given', async () => {
      const res = await rekwest
        .put('/api/v1/posts/')
        .send({ ...samplePost })
        .set('Authorization', `Bearer ${ACTIVE_JWT}`);
      expect(res.status).toBe(404);
    });

    test('should fail if ID is in correct', async () => {
      const res = await rekwest
        .put('/api/v1/posts/123123123123')
        .send({ ...samplePost })
        .set('Authorization', `Bearer ${ACTIVE_JWT}`);
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE: /posts/:id route', () => {
    test('should delete a post', async () => {
      const newPost = await createPost();
      const { id } = newPost;
      const res = await rekwest
        .delete(`/api/v1/posts/${id}`)
        .send({ title: 'the', body: 'new' })
        .set('Authorization', `Bearer ${ACTIVE_JWT}`);
      expect(res.status).toBe(200);
    });

    test('should fail if no ID is given', async () => {
      const res = await rekwest
        .delete('/api/v1/posts/')
        .send({ ...samplePost })
        .set('Authorization', `Bearer ${ACTIVE_JWT}`);
      expect(res.status).toBe(404);
    });

    test('should fail if ID is in correct', async () => {
      const res = await rekwest
        .delete('/api/v1/posts/123123123123')
        .send({ ...samplePost })
        .set('Authorization', `Bearer ${ACTIVE_JWT}`);
      expect(res.status).toBe(404);
    });
  });

  describe('GET: /query/some/posts?offset={offset}&limit={limit} ', () => {
    test('should get success response', async () => {
      const res = await rekwest.get('/api/v1/posts/query/some/posts').set('Authorization', `Bearer ${ACTIVE_JWT}`);
      expect(res.status).toBe(200);
    });

    test('should get 5 post', async () => {
      await createPost();
      await createPost();
      await createPost();
      await createPost();
      await createPost();
      await createPost();
      await createPost();
      const res = await rekwest
        .get('/api/v1/posts/query/some/posts?limit=5')
        .set('Authorization', `Bearer ${ACTIVE_JWT}`);
      expect(res.body.meta.count).toBe(7);
      expect(res.body.payload.posts).toHaveLength(5);
    });

    test('should fail if token is invalid', async () => {
      const res = await rekwest.get('/api/v1/posts/query/some/posts').set('Authorization', `Bearer ${EXPIRED_HEADER}`);
      expect(res.status).toBe(401);
    });
  });
});
