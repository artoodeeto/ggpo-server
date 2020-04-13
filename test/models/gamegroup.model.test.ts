import { Connection, createConnection } from 'typeorm';
import { GameGroup } from '../../src/models/gameGroup';
import { testSetup } from '../../config/test_setup';
import { descriptionModel } from '../../helpers/model_tester';

describe('GameGroup model test', () => {
  let connection: Connection;
  let modelDescription: () => Promise<any>;

  beforeEach(async () => {
    connection = await createConnection(testSetup);

    modelDescription = async (): Promise<any> => {
      const columnInformation: Array<any> = await GameGroup.query(`
      DESCRIBE game_groups
    `);
      return descriptionModel(columnInformation);
    };
  });

  afterEach(async () => {
    connection.close();
  });

  describe('Test model constraints', () => {
    it('GameGroup constraints', async () => {
      const { id, title, createdAt, updatedAt } = await modelDescription();
      expect(id.type).toMatch(/int/);
      expect(id.null).toMatch('NO');
      expect(id.key).toMatch('PRI');
      expect(id.default).toBeNull();
      expect(id.extra).toMatch('auto_increment');

      expect(title.type).toMatch(/varchar/);
      expect(title.null).toMatch('NO');
      expect(title.default).toBeNull();

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
