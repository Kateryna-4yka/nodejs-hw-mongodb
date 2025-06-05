// хешування паролю bcrypt
import bcrypt from 'bcrypt';

// генерування аксес та рефреш токінів
import { randomBytes } from 'crypto';

import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';

const createSession = (userId) => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};


export const registerUser = async (payload) => {
  // перевіряємо, чи є вже такий емейл в базі
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user!==null) throw createHttpError(409, 'Email in use');

  // захешовуємо пароль в бд
  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

// ===================================ЛогІН користувачів
export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  // перевіряємо, чи є вже такий емейл в базі
    if (user===null) {
    throw createHttpError(401, 'Unauthorized');
  }

    // перевіряємо, чи співпадає пароль (приймає першим аргументом те що передав користувач та порівнює з тим що в базі)
  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  // видаляємо сесію користувача, якщо вона вже існує, щоб не було конфліктів
await SessionsCollection.deleteOne({ userId: user._id });

// генеруються нові токени доступу та оновлення
 const sessionData = createSession(user._id);

  // створюємо нашому користувачеві нову сесію
  return await SessionsCollection.create(sessionData);
};

// ===================================ЛогАУТ користувачів===============================
export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

// ===============================функцію для refresh===============================
export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > new Date(session.refreshTokenValidUntil)) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession(session.userId);

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionsCollection.create(newSession);
};
