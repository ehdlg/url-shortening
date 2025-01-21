import { RequestHandler } from 'express';
import {
  getByCode,
  getAll,
  create,
  getByUrl,
  deleteByCode,
  update,
  getStatsByCode,
  incrementAccessCount,
} from '../models/Shorten';
import HttpError from '../errors/HttpError';

export const getUrl: RequestHandler = async (req, res, next) => {
  const { shortCode } = req.params;
  try {
    const url = await getByCode(shortCode);

    if (url == null) throw new HttpError({ status: 404, message: 'URL not found' });

    incrementAccessCount(shortCode);

    return res.json(url);
  } catch (error) {
    next(error);
  }
};

export const getAllUrl: RequestHandler = async (_req, res, next) => {
  try {
    const urls = await getAll();

    return res.json(urls);
  } catch (error) {
    next(error);
  }
};

export const getStats: RequestHandler = async (req, res, next) => {
  const { shortCode } = req.params;

  try {
    const url = await getStatsByCode(shortCode);

    if (url == null) throw new HttpError({ status: 404, message: 'URL not found' });

    return res.json(url);
  } catch (error) {
    next(error);
  }
};

export const createUrl: RequestHandler = async (req, res, next) => {
  try {
    const { url } = req.body;

    const existingUrl = await getByUrl(url);

    const isUrlDuplicate = null != existingUrl;

    if (isUrlDuplicate) return res.status(200).json(existingUrl);

    const newUrl = await create(url);

    return res.status(201).json(newUrl);
  } catch (error) {
    next(error);
  }
};

export const deleteUrl: RequestHandler = async (req, res, next) => {
  const { shortCode } = req.params;

  try {
    const shortCodeExists = null != (await getByCode(shortCode));

    if (!shortCodeExists) throw new HttpError({ status: 404, message: 'URL not found' });

    const deleted = deleteByCode(shortCode);

    if (!deleted) throw new HttpError({ message: 'The URL could not be deleted', status: 502 });

    return res.status(204).json();
  } catch (error) {
    next(error);
  }
};

export const updateUrl: RequestHandler = async (req, res, next) => {
  const { shortCode } = req.params;
  const { url } = req.body;

  try {
    const urlToUpdate = await getByCode(shortCode);

    if (null == urlToUpdate) throw new HttpError({ status: 404, message: 'Short URL not found' });
    if (urlToUpdate.url === url) throw new HttpError({ status: 400, message: 'Same URL' });

    const existingUrl = null != (await getByUrl(url));

    if (existingUrl)
      throw new HttpError({
        status: 409,
        message: 'A resource with the provided URL already exists',
      });

    const updated = await update(shortCode, url);

    if (!updated) throw new HttpError({ message: 'Could not update the URL', status: 502 });

    const updatedUrl = await getByCode(shortCode);

    return res.json(updatedUrl);
  } catch (error) {
    next(error);
  }
};
