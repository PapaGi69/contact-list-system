import 'reflect-metadata';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

export const AppDataSource = new DataSource({
  type: process.env.DATABASE_TYPE,
  url: process.env.DATABASE_URL,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  // We are using migrations, synchronize should be set to false
  synchronize: false,
  dropSchema: false,
  keepConnectionAlive: true,
  logging: process.env.NODE_ENV !== 'production',
  migrationsTable: 'migrationsTableName',
  entities: [join(__dirname + '../modules/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname + 'migrations/**/*{.ts,.js}')],
  cli: {
    entities: [join(__dirname + '../modules/**/*.entity{.ts,.js}')],
    migrations: [join(__dirname + 'migrations/**/*{.ts,.js}')],
  },
} as DataSourceOptions);
