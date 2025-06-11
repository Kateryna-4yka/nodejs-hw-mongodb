import { Router } from 'express';
import contactsRouter from './contacts.routers.js';
import authRouter from './auth.routers.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/contacts', authenticate , contactsRouter);

export default router;

// тут ми поєднуємо підключення двох гілок роутів. Запити по контактам та запити по користувачу
