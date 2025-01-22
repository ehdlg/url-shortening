import { DB_FILE_PATH } from '../constants';
import { createClient } from '@libsql/client';
import 'dotenv/config';
import HttpError from '../errors/HttpError';

const { NODE_ENV, TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } = process.env;

const IS_PRODUCTION = NODE_ENV === 'prod';

const url = IS_PRODUCTION ? TURSO_DATABASE_URL : `file:${DB_FILE_PATH}`;

if (null == url)
  throw new HttpError({ message: 'Database URL is not properly configured', status: 500 });

const db = createClient({ url, authToken: TURSO_AUTH_TOKEN });

export default db;
