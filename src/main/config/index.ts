import { config } from "dotenv";
import { app } from "electron";
import { join } from "path";
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const STATIC_PATH = join(app.getAppPath(), "static");

export const STATIC_FILE_PATH = join(STATIC_PATH, "files");

export const CREDENTIALS = process.env.CREDENTIALS === "true";

const { NODE_ENV, DB_DATABASE, LOG_FORMAT, ORIGIN } = process.env;

export const PORT = "0000";

export { NODE_ENV, DB_DATABASE, LOG_FORMAT, ORIGIN };

export const DB_PATH = join(app.getAppPath(), "sqlite/database.sqlite")
