import { Connection, createConnection } from 'typeorm';
import { ValidationError, validate, validateOrReject } from 'class-validator';
import { User } from '../../src/models/user';
import { testSetup } from '../../config/test_setup';

describe('User model test', () => {
  let connection: Connection;

  beforeEach(async () => {
    connection = await createConnection(testSetup);
  });

  afterEach(async () => {
    connection.close();
  });

  it('should create a user', async (done) => {
    const user = await User.create({
      username: 'foo',
      email: 'foo@gmail12as.com',
      password: 'password'
    }).save();

    expect(user.id).toEqual(1);
    done();
  });

  test('password should be hashed', async (done) => {
    const user = await User.create({
      username: 'foo',
      email: 'qwas.com',
      password: 'password'
    }).save();
    expect(user.password).not.toEqual('password');
    done();
  });

  test('should not create a user with the same email', async () => {
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

  test('should throw an error if email is incorrect format', async () => {
    const user = User.create({
      username: 'bar',
      email: 'foo',
      password: 'password'
    });

    try {
      await user.validateModel();
    } catch (error) {
      expect(error[0].constraints).toContainKey('isEmail');
      expect(error[0].constraints.isEmail).toMatch('email must be an email');
    }
  });

  test('should throw an error if username is empty', async () => {
    const user = User.create({
      username: '',
      email: 'foo@gmail.com',
      password: 'password'
    });

    try {
      await user.validateModel();
    } catch (error) {
      expect(error[0].constraints).toContainKey('isNotEmpty');
      expect(error[0].constraints.isNotEmpty).toMatch('username should not be empty');
    }
  });

  it('should throw an error if email is empty', async () => {
    const user = User.create({
      username: 'wadas',
      email: '',
      password: 'password'
    });

    try {
      await user.validateModel();
    } catch (error) {
      expect(error[0].constraints).toContainKey('isNotEmpty');
      expect(error[0].constraints.isNotEmpty).toMatch('email should not be empty');
    }
  });

  it('should throw an error if password is empty', async () => {
    const user = User.create({
      username: 'wawa',
      email: 'adsf@gmail.com',
      password: ''
    });

    try {
      await user.validateModel();
    } catch (error) {
      expect(error[0].constraints).toContainKey('isNotEmpty');
      expect(error[0].constraints.isNotEmpty).toMatch('password should not be empty');
    }
  });
});
