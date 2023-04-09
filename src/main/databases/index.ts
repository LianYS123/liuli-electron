import { DataSourceOptions } from "typeorm";
import { ArticleEntity } from "../entities/article.entity";
import { FileEntity } from "../entities/file.entity";
import { DB_PATH } from "../config";

export const dbConnection: DataSourceOptions = {
  type: "sqlite",
  database: DB_PATH,
  synchronize: true,
  logging: true,
  entities: [ArticleEntity, FileEntity]
  // entities: ["src/main/entities/*.entity{.ts,.js}"]
  // migrations: ["../**/*.migration{.ts,.js}"],
  // subscribers: ["../**/*.subscriber{.ts,.js}"]
};
