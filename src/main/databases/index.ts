import { DataSourceOptions } from "typeorm";
import { DB_DATABASE } from "@src/main/config";
import { ArticleEntity } from "../entities/article.entity";
import { FileEntity } from "../entities/file.entity";

export const dbConnection: DataSourceOptions = {
  type: "sqlite",
  database: DB_DATABASE,
  synchronize: true,
  logging: true,
  entities: [ArticleEntity, FileEntity]
  // entities: ["src/main/entities/*.entity{.ts,.js}"]
  // migrations: ["../**/*.migration{.ts,.js}"],
  // subscribers: ["../**/*.subscriber{.ts,.js}"]
};
