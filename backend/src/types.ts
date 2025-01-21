import { Row } from '@libsql/client/';

export type URL = {
  id: number;
  url: string;
  shortCode: string;
  createdAt: string;
  updatedAt: string | null;
} & Row;

export type HttpErrorOptions = {
  status: number;
  message: string;
};

export type URLStats = URL & { accessCount: number };
