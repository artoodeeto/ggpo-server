import { Connection, createConnection } from 'typeorm';
import { User } from '../../src/models/user_model';
import ormConfig from '../../ormconfig';

describe('User model test', () => {
  let connection: Connection;

  beforeEach(async () => {
    connection = await createConnection(ormConfig);
  });

  afterEach(async () => {
    connection.close();
  })

  it('should create a user', async (done) => {
    const user = await User.create({
      username: 'foo',
      email: 'foo@gmail.com',
      password: 'password'
    }).save();

    expect(user.id).toEqual(1);
    done();
  });


  it('should not create a user with the same email', async (done) => {

    try {
      await User.create({
        username: 'bar',
        email: 'foo@gmail.com',
        password: 'password'
      }).save();

      await User.create({
        username: 'foo',
        email: 'foo@gmail.com',
        password: 'password'
      }).save();
    } catch (error) {
      expect(error.message).toMatch(/Duplicate entry /);
    }
    done();
  });

  it('should not be saved if email is not in right format', async (done) => {

    try {
      await User.create({
        username: 'bar',
        email: 'foo',
        password: 'password'
      }).save();

    } catch (error) {
      expect(error.message).toMatch(/Duplicate entry /);
    }
    done();
  });

});
