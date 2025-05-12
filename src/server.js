import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import path from 'path';
import { fileURLToPath } from 'url';


import { getAllContactsController, getContactById, getContactByName } from './controllers/contacts.js';

const PORT = 3000;

export default function setupServer () {

const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );


// ===================================Запити на сервер за всіма контактами
app.get ("/contacts", getAllContactsController);

// ===================================Запити на сервер за 1 контактом по його імені
app.get("/contacts/search", getContactByName);

// ===================================Запити на сервер за 1 контактом по його айді
app.get ("/contacts/:id", getContactById);


const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '..', 'public')));
// ====================================Middlewares
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Not found',
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    message: 'Something went wrong',
  });
});




app.listen (PORT, (er)=> {
    if (er) {throw er;}
    console.log(`Server is running on port ${PORT}`);
});
};
