import { Connection, createConnection } from 'typeorm';
import { ValidationError, validate, validateOrReject } from 'class-validator';
import { Post } from '../../src/models/post';
import { testSetup } from '../../config/test_setup';

describe('Post model test', () => {
  let connection: Connection;
  let modelDescription: () => Promise<any>;

  beforeEach(async () => {
    connection = await createConnection(testSetup);

    modelDescription = async () => {
      const columnInformation: Array<any> = await Post.query(`
      DESCRIBE posts
    `);
      return columnInformation.reduce((acc, curr) => {
        acc[curr['Field']] = {
          type: curr['Type'],
          null: curr['Null'],
          default: curr['Default'],
          extra: curr['Extra']
        };
        return acc;
      }, {});
    };
  });

  afterEach(async () => {
    connection.close();
  });

  it('should create a post', async () => {
    await Post.create({
      title: 'foo',
      body: 'foo@gmail12as.com'
    }).save();

    const postCount = await Post.findAndCount();
    expect(postCount[1]).toEqual(1);
  });

  it('should create a post', async () => {
    await Post.create({
      title: '',
      body: ''
    }).save();

    const postCount = await Post.findAndCount();
    expect(postCount[1]).toEqual(1);
  });

  it('should throw if given invalid or null values', () => {
    expect(Post.create({}).save()).toReject();
  });

  describe('Test model constraints', () => {
    it('Post constraints', async () => {
      const { id, title, body, createdAt, updatedAt } = await modelDescription();
      expect(id.type).toMatch(/int/);
      expect(id.null).toMatch('NO');
      expect(id.default).toBeNull();

      expect(title.type).toMatch(/varchar/);
      expect(title.null).toMatch('NO');
      expect(title.default).toBeNull();

      expect(body.type).toMatch('mediumtext');
      expect(body.null).toMatch('NO');
      expect(body.default).toBeNull();

      expect(createdAt.type).toMatch('datetime');
      expect(createdAt.null).toMatch('NO');
      expect(createdAt.default).toBeNull();

      expect(updatedAt.type).toMatch('datetime');
      expect(updatedAt.null).toMatch('NO');
      expect(updatedAt.default).toMatch('CURRENT_TIMESTAMP');
      expect(updatedAt.extra).toMatch('DEFAULT_GENERATED');
    });
  });
});
