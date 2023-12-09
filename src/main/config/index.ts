import { config } from 'dotenv';
import { app } from 'electron';
import { join } from 'path';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const STATIC_PATH = join(app.getPath('appData'), 'static');

export const STATIC_FILE_PATH = join(STATIC_PATH, 'files');

const { NODE_ENV, DB_DATABASE, LOG_FORMAT, ORIGIN } = process.env;

export { NODE_ENV, DB_DATABASE, LOG_FORMAT, ORIGIN };

export const DB_PATH = join(app.getPath('userData'), 'sqlite/database.sqlite');
// export const DB_PATH = "sqlite/database.sqlite";
