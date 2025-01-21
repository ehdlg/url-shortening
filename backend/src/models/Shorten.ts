import { URL, URLStats } from '../types';
import db from '../db';
import { generateShortCode } from '../utils';

export const getAll = async () => {
  const sql = 'SELECT * FROM urls';

  const { rows } = await db.execute(sql);

  return rows as URL[];
};

export const getByCode = async (shortCode: string) => {
  const sql = `SELECT id, url, short_code as shortCode, created_at as createdAt, updated_at as updatedAt 
                 FROM urls 
                 WHERE short_code = ?`;
  const args = [shortCode];

  const result = await db.execute({ sql, args });
  const [row] = result.rows as URL[];

  return row || null;
};

export const getByUrl = async (url: string) => {
  const sql = `SELECT id, url, short_code as shortCode, created_at as createdAt, updated_at as updatedAt 
                 FROM urls 
                 WHERE url = ?`;
  const args = [url];

  const result = await db.execute({ sql, args });
  const [row] = result.rows as URL[];

  return row;
};

export const getStatsByCode = async (shortCode: string) => {
  const sql = `SELECT id, url, short_code as shortCode, created_at as createdAt, 
                        updated_at as updatedAt, access_count as accessCount 
                 FROM urls 
                 WHERE short_code = ?`;
  const args = [shortCode];

  const { rows } = await db.execute({ sql, args });
  const [row] = rows as URLStats[];

  return row || null;
};

const getById = async (id: number) => {
  const sql = `SELECT id, url, short_code as shortCode, created_at as createdAt, updated_at as updatedAt  
                FROM urls WHERE id = ?`;

  const args = [id];
  const result = await db.execute({ sql, args });
  const { rows } = result;
  const [row] = rows as URL[];

  return row || null;
};

export const create = async (url: string) => {
  const sql = 'INSERT INTO urls(url, short_code) VALUES (?, ?)';
  const shortCode = await generateShortCode();
  const args = [url, shortCode];

  const insert = await db.execute({ sql, args });

  const { lastInsertRowid: id } = insert;

  if (null == id) return null;

  const row = await getById(Number(id));

  return row;
};

export const deleteByCode = async (shortCode: string) => {
  const sql = 'DELETE FROM urls WHERE short_code = ?';
  const args = [shortCode];

  const result = await db.execute({ sql, args });

  return result.rowsAffected > 0;
};

export const update = async (shortCode: string, newUrl: string) => {
  const sql = 'UPDATE urls SET url = ?, updated_at = CURRENT_TIMESTAMP WHERE short_code = ?';
  const args = [newUrl, shortCode];

  const rows = await db.execute({ sql, args });

  return rows.rowsAffected > 0;
};

export const incrementAccessCount = async (shortCode: string) => {
  const sql = 'UPDATE urls SET access_count = access_count + 1 WHERE short_code = ?';
  const args = [shortCode];

  const result = await db.execute({ sql, args });

  return result.rowsAffected > 0;
};
