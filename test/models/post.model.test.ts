import { Connection, createConnection } from 'typeorm';
import { Post } from '../../src/models/post';
import { testSetup } from '../../config/test_setup';
import { descriptionModel } from '../../src/helpers/model_tester';

describe('Post model test', () => {
  let connection: Connection;
  let modelDescription: () => Promise<any>;
  beforeEach(async () => {
    connection = await createConnection(testSetup);
    modelDescription = async (): Promise<any> => {
      const columnInformation: Array<any> = await Post.query(`
      DESCRIBE posts
    `);
      return descriptionModel(columnInformation);
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
  it('should reject if given an empty property', async () => {
    const p = Post.create({
      title: '',
      body: ''
    });
    await expect(p.validateModel()).toReject();
  });
  it('should throw if given invalid or null values', () => {
    expect(Post.create({}).save()).toReject();
  });
  describe('Test model constraints', () => {
    it('Post constraints', async () => {
      const { id, title, body, createdAt, updatedAt } = await modelDescription();
      expect(id.type).toMatch(/int/);
      expect(id.null).toMatch('NO');
      expect(id.key).toMatch('PRI');
      expect(id.extra).toMatch('auto_increment');
      expect(title.type).toMatch(/varchar/);
      expect(title.null).toMatch('NO');
      expect(title.default).toBeNull();
      expect(body.type).toMatch('varchar');
      expect(body.null).toMatch('NO');
      expect(body.default).toBeNull();
      expect(createdAt.type).toMatch('timestamp');
      expect(createdAt.null).toMatch('YES');
      expect(createdAt.default).toMatch('CURRENT_TIMESTAMP');
      expect(updatedAt.type).toMatch('timestamp');
      expect(updatedAt.null).toMatch('YES');
      expect(updatedAt.default).toMatch('CURRENT_TIMESTAMP');
      expect(updatedAt.extra).toMatch('DEFAULT_GENERATED');
    });
  });
});
