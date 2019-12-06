import request from "supertest";
import { AppServer } from '../../config/server';
const server = new AppServer();
const appInstance = server.appInstance;
const rekwest = request(appInstance);

describe('Get all users', () => {
  it('should return status code 200', async (done) => {
    const res = await rekwest.get('/api/v1/users');
    expect(res.status).toBe(200);
    expect(res.header['content-type']).toMatch(/json/)
    done();
  })

  it('should return a content type of application/json', async (done) => {
    rekwest.get('/api/v1/users/')
      .expect('Content-Type', /json/)
      .end(done);
  })
})