// ===================================post user

import { loginUser, refreshUsersSession, registerUser, logoutUser, requestResetToken, resetPassword } from '../services/auth.services.js';
import { THIRTY_DAYS, FIFTEEN_MINUTES } from '../constants/index.js';


//  створення куків , які ми вже глобально підключили в сервер.джіс
// викликаємо метод кукі (назва куки, значення цієї куки, опції до нех,
// httpOnly: true щоб браузер не мав доступу до нашого коду ,
// expires: new Date(Date.now() + THIRTY_DAYS) властивість що вказує, до якого часу буде жити ця кука)
const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + FIFTEEN_MINUTES),
  });
};
export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};
// ===================================ЛогІН користувачів
export const loginUserController = async (req, res) => {
 const session = await loginUser(req.body);

//  створення куків , які ми вже глобально підключили в сервер.джіс
// викликаємо метод кукі (назва куки, значення цієї куки, опції до нех,
// httpOnly: true щоб браузер не мав доступу до нашого коду ,
// expires: new Date(Date.now() + THIRTY_DAYS) властивість що вказує, до якого часу буде жити ця кука)
setupSession(res, session);

    res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
// ===================================ЛогАУТ користувачів
export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  // чистимо кукі
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).end();
};
// ===================================рефреш сесії
export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
// ================контролер для обробки запиту на зміну пароля
export const requestResetEmailController = async (req, res) => {
const {email} = req.body;
if (!email) {
      return res.status(400).json({ status: 'error', message: 'Email is required' });
    }

  await requestResetToken(email);
  res.json({
    status: 200,
    message: "Reset password email has been successfully sent.",
    data: {}
  });
};

export const resetPasswordController = async (req, res) => {

  const {password, token} = req.body;

  await resetPassword({password, token});
  res.json({
    message: 'Password has been successfully reset.',
    status: 200,
  });
};
