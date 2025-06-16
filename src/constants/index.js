import path from 'node:path';


export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};


export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;


// =============константи для створення листа зміни пароля

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

// =============константи для шаблонізатору
export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');


// налаштування для мултера , який працює з картинками
export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');



export const CLOUDINARY = {
  CLOUD_NAME: 'CLOUD_NAME',
  API_KEY: 'API_KEY',
  API_SECRET: 'API_SECRET',
};


// повертаємо документацію до нашого застосунку
export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
