import { DataSource, DataSourceOptions } from 'typeorm';
import { ArticleEntity } from '../entity/article.entity';
import { FileEntity } from '../entity/file.entity';
import { DB_PATH } from '../config';
import { HistoryEntity } from '../entity/history.entity';

export const dbConnection: DataSourceOptions = {
  type: 'sqlite',
  database: DB_PATH,
  synchronize: true,
  logging: false,
  entities: [ArticleEntity, FileEntity, HistoryEntity],
  // entities: ["src/main/entities/*.entity{.ts,.js}"]
  // migrations: ["../**/*.migration{.ts,.js}"],
  // subscribers: ["../**/*.subscriber{.ts,.js}"]
};

export const dataSource = new DataSource(dbConnection)
