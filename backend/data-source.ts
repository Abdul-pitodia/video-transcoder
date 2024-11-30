import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'prod';

console.log('Dot env port -> ' + process.env.DATABASE_PORT);

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER_NAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: isProduction
    ? ['dist/**/*.entity.js'] // Only JS files in production
    : ['**/*.entity.ts'], // Only TS files in development
  migrations: isProduction
    ?  ['dist/src/db/migrations/*.js'] // Only JS migrations in production
    : ['src/db/migrations/*.ts'], // Only TS migrations in development
});
