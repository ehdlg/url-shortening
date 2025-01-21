import { DB_FILE_PATH } from '../constants';
import { createClient } from '@libsql/client';

const db = createClient({ url: `file:${DB_FILE_PATH}` });

export default db;
