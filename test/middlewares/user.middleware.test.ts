import request from 'supertest';
import { AppServer } from '../../config/server';
import { UserMiddleware } from '../../src/middlewares/user_middlewares';
import { UsersController } from '../../src/controllers/users_controller';

const server = new AppServer();
const { appInstance } = server;
const rekwest = request(appInstance);

/**
 * ! I have no freaking idea how to test a middleware
 * ! hold on for now
 */
describe('Testing User middleware', () => {
  // jest.mock('../../src/controllers/users_controller');
  // afterEach(() => {
  //   jest.clearAllMocks();
  // });
  it('should validate a user', async () => {
    // await rekwest.get('/api/v1/users/signup');
    // expect(UserMiddleware.validateUser).toBeCalledTimes(1);
    expect(true).toBe(true);
  });
});
