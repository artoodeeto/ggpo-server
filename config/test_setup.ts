// let ormConfig: any;

// if (process.env.NODE_ENV === 'test') {
// test environment database should be drop every time. so synchronize should be true for this config
export const testSetup: any = {
  type: 'mysql',
  host: '0.0.0.0',
  // host: 'localhost', // not needed if run on docker
  username: 'root',
  password: 'password',
  database: 'test_db',
  synchronize: true,
  dropSchema: true,
  entities: ['src/models/**/*.ts']
};
// } else {
//   ormConfig = {
//     type: 'mysql',
//     host: 'db', // docker service database name
//     // host: 'localhost', // not needed if run on docker
//     port: 3306, // not needed if run on docker
//     username: 'root',
//     password: 'password',
//     database: 'development_db',
//     synchronize: false,
//     logging: true,
//     entities: ['src/models/**/*.ts'],
//     migrations: ['db/migrations/**/*.ts'],
//     subscribers: ['src/subscribers/**/*.ts'],
//     cli: {
//       entitiesDir: 'src/models',
//       migrationsDir: 'db/migrations',
//       subscribersDir: 'src/subscribers'
//     }
//   };
// }

// export = ormConfig;
