import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// ===================підключення HML==========================================================
import path from 'path';
import { fileURLToPath } from 'url';
// ============================================================================================
import router from './routers/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

const PORT = 3000;

export default function setupServer () {
// =======================запускаємо роботу express()=========================================
  const app = express();

  //  =======================Для роботи із куками =============================
  app.use(cookieParser());

// =======================для розпарсювання джейсону (express.json())=========================
  // app.use(express.json()); або в роутах точково на потрібні роути

// =======================для запитів з інших шляхів (cors)===================================
  app.use(cors());

// =======================для великого та гарного тіла відповіді (pino-pretty)================
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

// ================підключаємо роути для роботи з контактами===================
  app.use(router);

// =======================html підключення==================================
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '..', 'public')));

// ===================================Міделвари помилок=========================
app.use(notFoundHandler);
app.use(errorHandler);

// =======================запуск сервера на PORT================================
app.listen (PORT, (er)=> {
    if (er) {throw er;}
    console.log(`Server is running on port ${PORT}`);
});
};
