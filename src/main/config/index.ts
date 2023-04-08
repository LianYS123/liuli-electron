import { config } from "dotenv";
import { app } from "electron";
import { join } from "path";
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const STATIC_PATH = join(app.getAppPath(), "static");

export const STATIC_FILE_PATH = join(STATIC_PATH, "files");

export const CREDENTIALS = process.env.CREDENTIALS === "true";
export const {
  NODE_ENV,
  PORT,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  UPLOAD_DIR,
  UPLOAD_TMP_DIR
} = process.env;
