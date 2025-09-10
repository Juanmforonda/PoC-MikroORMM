import { MySqlDriver, Options } from '@mikro-orm/mysql';
import { SeedManager } from '@mikro-orm/seeder';
import * as dotenv from 'dotenv';

dotenv.config();

const config: Options = {
  driver: MySqlDriver,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  dbName: process.env.DB_NAME || 'mikroorm_db_poc',
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  debug: process.env.NODE_ENV === 'development',
  extensions: [SeedManager],
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
  },
};

export default config;
