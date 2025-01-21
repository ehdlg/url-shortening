import { MAX_LETTER_CODE, MIN_LETTER_CODE, SHORT_URL_LENGTH } from '../constants';
import { getByCode } from '../models/Shorten';

export const generateRandomLetter = () => {
  const charCode = Math.floor(
    Math.random() * (MAX_LETTER_CODE - MIN_LETTER_CODE + 1) + MIN_LETTER_CODE
  );

  let letter = String.fromCharCode(charCode);

  if (Math.random() < 0.5) letter = letter.toUpperCase();

  return letter;
};

const checkIfCodeExists = async (shortCode: string) => {
  const url = await getByCode(shortCode);

  return null != url;
};

const generateRandomCode = () => {
  let code = '';

  for (let i = 0; i < SHORT_URL_LENGTH; i++) {
    code += generateRandomLetter();
  }

  return code;
};

export const generateShortCode = async () => {
  let shortCode;

  do {
    shortCode = generateRandomCode();
  } while (await checkIfCodeExists(shortCode));

  return shortCode;
};
