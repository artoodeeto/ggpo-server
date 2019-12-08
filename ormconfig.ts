let ormConfig: any;

if (process.env.NODE_ENV === 'test') {
   // test environment database should be drop every time. so synchronize should be true for this config 
   ormConfig = {
      type: 'mysql',
      host: 'localhost',
      username: 'root',
      password: 'password',
      database: 'test_db',
      synchronize: true,
      dropSchema: true,
      entities: [
         "src/models/**/*.ts"
      ],
   }
} else {
   ormConfig = {
      "type": "mysql",
      "host": "localhost",
      "port": 3306,
      "username": "root",
      "password": "password",
      "database": "development_db",
      "synchronize": false,
      "logging": true,
      "entities": [
         "src/models/**/*.ts"
      ],
      "migrations": [
         "db/migrations/**/*.ts"
      ],
      "subscribers": [
         "src/subscribers/**/*.ts"
      ],
      "cli": {
         "entitiesDir": "src/models",
         "migrationsDir": "db/migrations",
         "subscribersDir": "src/subscribers"
      }
   }
}

export default ormConfig;





