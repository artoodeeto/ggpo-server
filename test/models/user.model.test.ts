import { Connection, createConnection } from 'typeorm';
import { User } from '../../src/models/user';
import { testSetup } from '../../config/test_setup';
import { descriptionModel } from '../../src/helpers/model_tester';

describe('User model test', () => {
  let connection: Connection;
  let modelDescription: () => Promise<any>;

  beforeEach(async () => {
    connection = await createConnection(testSetup);

    modelDescription = async (): Promise<any> => {
      const columnInformation: Array<any> = await User.query(`
      DESCRIBE users
    `);
      return descriptionModel(columnInformation);
    };
  });

  afterEach(async () => {
    connection.close();
  });

  it('should create a user', async () => {
    const user = await User.create({
      username: 'foo',
      email: 'foo@gmail12as.com',
      password: 'Password123!'
    }).save();

    expect(user.id).toEqual(1);
  });

  test('should not create a user with the same email', async () => {
    await User.create({
      username: 'bar',
      email: 'foo@gmail.com',
      password: 'Password123!'
    }).save();

    const user2 = User.create({
      username: 'foo',
      email: 'foo@gmail.com',
      password: 'Password123!'
    });

    await expect(user2.save()).rejects.toThrowError();
  });

  describe('USER VALIDATIONS', () => {
    describe('USERNAME', () => {
      it('should throw an ERROR if username is empty', async () => {
        const user = User.create({
          username: '',
          email: 'foo@gmail12as.com',
          password: 'Password123!'
        });

        await expect(user.validateModel()).toReject();
      });
    });

    describe('EMAIL', () => {
      it('should throw an ERROR if email is empty', async () => {
        const user = User.create({
          username: 'somename',
          email: '',
          password: 'Password123!'
        });

        try {
          await user.validateModel();
        } catch (error) {
          expect(error.constraints[0]).toContainKey('isNotEmpty');
          expect(error.constraints[0].isNotEmpty).toMatch('email should not be empty');
        }

        await expect(user.validateModel()).toReject();
      });

      test('should throw an ERROR if email is incorrect format', async () => {
        const user = User.create({
          username: 'bar',
          email: 'foo',
          password: 'Password123!'
        });

        try {
          await user.validateModel();
        } catch (error) {
          expect(error.constraints[0]).toContainKey('isEmail');
          expect(error.constraints[0].isEmail).toMatch('email must be an email');
        }
        await expect(user.validateModel()).toReject();
      });
    });

    describe('PASSWORD', () => {
      it('should throw an ERROR if password is empty', async () => {
        const user = User.create({
          username: 'somename',
          email: 'someemal@gmail.com',
          password: ''
        });

        try {
          await user.validateModel();
        } catch (error) {
          expect(error.constraints[0]).toContainKey('isNotEmpty');
          expect(error.constraints[0].isNotEmpty).toMatch('password should not be empty');
        }

        await expect(user.validateModel()).toReject();
      });

      test('should throw an ERROR if password is less than 8 characters', async () => {
        const user = User.create({
          username: 'bar',
          email: 'foo@yahoomail.com',
          password: 'pass'
        });

        try {
          await user.validateModel();
        } catch (error) {
          expect(error.constraints[0]).toContainAnyKeys(['minLength']);
        }
        await expect(user.validateModel()).toReject();
      });

      test('should throw an ERROR if password doesnt match any !@#$%^&', async () => {
        const user = User.create({
          username: 'bar',
          email: 'foo@yahoomail.com',
          password: 'Password'
        });

        try {
          await user.validateModel();
        } catch (error) {
          expect(error.constraints[0]).toContainAnyKeys(['matches']);
        }
        await expect(user.validateModel()).toReject();
      });

      test('should throw an ERROR if password doesnt match any A-Z', async () => {
        const user = User.create({
          username: 'bar',
          email: 'foo@yahoomail.com',
          password: 'password@1'
        });

        try {
          await user.validateModel();
        } catch (error) {
          expect(error.constraints[0]).toContainAnyKeys(['matches']);
        }
        await expect(user.validateModel()).toReject();
      });

      test('should throw an ERROR if password doesnt match any 0-9', async () => {
        const user = User.create({
          username: 'bar',
          email: 'foo@yahoomail.com',
          password: 'password@'
        });

        try {
          await user.validateModel();
        } catch (error) {
          expect(error.constraints[0]).toContainAnyKeys(['matches']);
        }
        await expect(user.validateModel()).toReject();
      });

      test('password should be hashed', async () => {
        const user = await User.create({
          username: 'foo',
          email: 'qwas@foo.com',
          password: 'Password123!'
        }).save();
        expect(user.password).not.toEqual('Password123!');
      });
    });
  });

  describe('Test model constraints', () => {
    it('User constraints', async () => {
      const { id, username, email, password, createdAt, updatedAt } = await modelDescription();

      expect(id.type).toMatch(/int/);
      expect(id.null).toMatch('NO');
      expect(id.key).toMatch('PRI');
      expect(id.default).toBeNull();
      expect(id.extra).toMatch('auto_increment');

      expect(username.type).toMatch(/varchar/);
      expect(username.null).toMatch('NO');
      expect(username.default).toBeNull();

      expect(email.type).toMatch(/varchar/);
      expect(email.null).toMatch('NO');
      expect(email.default).toBeNull();

      expect(password.type).toMatch(/varchar/);
      expect(password.null).toMatch('NO');
      expect(password.default).toBeNull();

      expect(createdAt.type).toMatch('timestamp');
      expect(createdAt.null).toMatch('YES');
      expect(createdAt.default).toMatch('CURRENT_TIMESTAMP');
      expect(updatedAt.extra).toMatch('DEFAULT_GENERATED');

      expect(updatedAt.type).toMatch('timestamp');
      expect(updatedAt.null).toMatch('YES');
      expect(updatedAt.default).toMatch('CURRENT_TIMESTAMP');
      expect(updatedAt.extra).toMatch('DEFAULT_GENERATED');
    });
  });
});
