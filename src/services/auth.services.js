// хешування паролю bcrypt
import bcrypt from 'bcrypt';

// генерування аксес та рефреш токінів
import { randomBytes } from 'crypto';

import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';

// для надсилання повідомлень на пошту
import jwt from 'jsonwebtoken';
import { SMTP } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import path from 'node:path';
import * as fs from 'node:fs';
import { error } from 'node:console';
import { getFullNameFromGoogleTokenPayload, validateCode } from '../utils/googleOAuth2.js';


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
// ==========================ресет пароля
export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email: email });

  const name = user.name;
  if (!user) {
    throw new createHttpError(404, 'User not found!');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const resetPasswordTemplatePath = fs.readFileSync(path.resolve('src', 'templates', 'reset-password-email.hbs'), "UTF-8");

  const template = handlebars.compile(resetPasswordTemplatePath);

  const html = template({
    name,
    link: `${getEnvVar('APP_DOMAIN')}/auth/reset-pwd?token=${resetToken}`,
  });

try {
  await sendEmail({
    from: getEnvVar(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset password',
    html,
  });
} catch (error) {
  throw new createHttpError(500, 'Failed to send the email, please try again later.');
}
};

export const resetPassword = async ({password, token}) => {

  try {
  const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));

  // шукаємо користувача
  const user = await UsersCollection.findById(decoded.sub);
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

// якщо користувачч є то хешуємо його пароль та змінюємо у базі данних
  const encryptedPassword = await bcrypt.hash(password, 10);

  await UsersCollection.findByIdAndUpdate(user._id , {password: encryptedPassword});

  await SessionsCollection.deleteMany({ userId: user._id });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {throw new createHttpError(401, "Token is unauthorized");};
    if (error.name === "TokenExpiredError") {throw new createHttpError(401, "Token is expired or invalid.");};
    throw error;
};
};

export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();
  if (!payload) throw createHttpError(401);

  let user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    const password = await bcrypt.hash(randomBytes(10), 10);
    user = await UsersCollection.create({
      email: payload.email,
      name: getFullNameFromGoogleTokenPayload(payload),
      password,
      role: 'user',
    });
  }
  await SessionsCollection.deleteMany({ userId: user._id });
  const newSession = createSession();

  return await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
};
