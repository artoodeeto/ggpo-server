import { Connection, createConnection } from 'typeorm';
import { ValidationError, validate } from 'class-validator';
import { User } from '../../src/models/user_model';
import ormConfig from '../../ormconfig';

describe('User model test', () => {
  let connection: Connection;

  beforeEach(async () => {
    connection = await createConnection(ormConfig);
  });

  afterEach(async () => {
    connection.close();
  });

  it('should create a user', async (done) => {
    const user = await User.create({
      username: 'foo',
      email: 'foo@gmail.com',
      password: 'password'
    }).save();

    expect(user.id).toEqual(1);
    done();
  });

  it('should not create a user with the same email', async () => {
    await User.create({
      username: 'bar',
      email: 'foo@gmail.com',
      password: 'password'
    }).save();

    const user2 = User.create({
      username: 'foo',
      email: 'foo@gmail.com',
      password: 'password'
    });

    await expect(user2.save()).rejects.toThrowError();
  });

  it('should throw an error if email is incorrect format', async () => {
    const user = User.create({
      username: 'bar',
      email: 'foo',
      password: 'password'
    });

    // ? toResolve() is from jest-extended
    // ? if your thinking whats the 3dots below the await its because I don't know too so i filled a bug report on jest-extended
    // ? https://github.com/jest-community/jest-extended/issues/256
    await expect(user.validateModel()).toReject();

    // ? this errors out when testing async code
    // ? this code throwing but for some reason jest doesn't know it
    // await expect(user.validateModel()).rejects.toThrowError();
  });
});
