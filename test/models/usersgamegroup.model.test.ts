import { Connection, createConnection } from 'typeorm';
import { UsersGameGroup } from '../../src/models/usersGameGroup';
import { testSetup } from '../../config/test_setup';
import { descriptionModel } from '../../src/helpers/model_tester';

describe('UsersGameGroup model test', () => {
  let connection: Connection;
  let modelDescription: () => Promise<any>;
  beforeEach(async () => {
    connection = await createConnection(testSetup);
    modelDescription = async (): Promise<any> => {
      const columnInformation: Array<any> = await UsersGameGroup.query(`
      DESCRIBE users_game_groups
    `);
      return descriptionModel(columnInformation);
    };
  });
  afterEach(async () => {
    connection.close();
  });
  describe('Test model constraints', () => {
    it('UsersGameGroup constraints', async () => {
      const { id, userId, gameGroupId, createdAt, updatedAt } = await modelDescription();
      expect(id.type).toMatch(/int/);
      expect(id.null).toMatch('NO');
      expect(id.key).toMatch('PRI');
      expect(id.default).toBeNull();
      expect(id.extra).toMatch('auto_increment');
      expect(userId.type).toMatch(/int/);
      expect(userId.null).toMatch('NO');
      expect(userId.key).toMatch('MUL');
      expect(gameGroupId.type).toMatch(/int/);
      expect(gameGroupId.null).toMatch('NO');
      expect(gameGroupId.key).toMatch('MUL');
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
