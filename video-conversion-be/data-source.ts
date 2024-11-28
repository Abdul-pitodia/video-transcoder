import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

console.log('Dot env port -> ' + process.env.DATABASE_PORT);

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER_NAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['**/*.entity.ts'],
  migrations: ['src/db/migrations/*.ts']
});
