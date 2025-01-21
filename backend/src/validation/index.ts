import { body, param } from 'express-validator';
import { SHORT_URL_REGEXP } from '../constants';

export const urlRule = (() => {
  return [
    body('url').exists().bail().isURL({ require_protocol: false }).withMessage('Invalid URL'),
  ];
})();

export const shortUrlRule = (() => {
  return [param('shortCode').matches(SHORT_URL_REGEXP).withMessage('Invalid short URL')];
})();
