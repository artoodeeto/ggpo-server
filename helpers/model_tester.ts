/**
 * @description this returns
 * [
    TextRow {
      Field: 'id',
      Type: 'int(11)',
      Null: 'NO',
      Key: 'PRI',
      Default: null,
      Extra: 'auto_increment'
    },
    TextRow {
      Field: 'title',
      Type: 'varchar(255)',
      Null: 'NO',
      Key: '',
      Default: null,
      Extra: ''
    },
    TextRow {
      Field: 'createdAt',
      Type: 'timestamp(6)',
      Null: 'YES',
      Key: '',
      Default: 'CURRENT_TIMESTAMP(6)',
      Extra: 'DEFAULT_GENERATED'
    },
    TextRow {
      Field: 'updatedAt',
      Type: 'timestamp(6)',
      Null: 'YES',
      Key: '',
      Default: 'CURRENT_TIMESTAMP(6)',
      Extra: 'DEFAULT_GENERATED'
    },
    TextRow {
      Field: 'deletedAt',
      Type: 'timestamp(6)',
      Null: 'YES',
      Key: '',
      Default: null,
      Extra: ''
    }
  ]
 *
 * @param col
 */
export function descriptionModel(col: Array<any>) {
  return col.reduce((acc, curr) => {
    acc[curr['Field']] = {
      type: curr['Type'],
      null: curr['Null'],
      key: curr['Key'],
      default: curr['Default'],
      extra: curr['Extra']
    };
    return acc;
  }, {});
}
