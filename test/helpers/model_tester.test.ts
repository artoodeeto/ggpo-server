import { descriptionModel } from '../../src/helpers/model_tester';

const returnTableDescription = [
  {
    Field: 'id',
    Type: 'int(11)',
    Null: 'NO',
    Key: 'PRI',
    Default: null,
    Extra: 'auto_increment'
  },
  {
    Field: 'title',
    Type: 'varchar(255)',
    Null: 'NO',
    Key: '',
    Default: null,
    Extra: ''
  },
  {
    Field: 'createdAt',
    Type: 'timestamp(6)',
    Null: 'YES',
    Key: '',
    Default: 'CURRENT_TIMESTAMP(6)',
    Extra: 'DEFAULT_GENERATED'
  },
  {
    Field: 'updatedAt',
    Type: 'timestamp(6)',
    Null: 'YES',
    Key: '',
    Default: 'CURRENT_TIMESTAMP(6)',
    Extra: 'DEFAULT_GENERATED'
  },
  {
    Field: 'deletedAt',
    Type: 'timestamp(6)',
    Null: 'YES',
    Key: '',
    Default: null,
    Extra: ''
  }
];

// I DON'T KNOW WHAT IM DOING HERE IM JUST MAKING SURE IT CONTAINS THESE KEYS
// BECAUSE ITS BEING USED FROM TEST MODEL
// IM ALSO JUST TESTING FOR A COLUMN ID HERE
describe('DESCRIPTION MODEL', () => {
  it('should be an object with keys', () => {
    const restructuredModel = descriptionModel(returnTableDescription);

    expect(restructuredModel).toBeObject();
    expect(restructuredModel.id).toContainKeys(['type', 'null', 'key', 'default', 'extra']);
  });
});
