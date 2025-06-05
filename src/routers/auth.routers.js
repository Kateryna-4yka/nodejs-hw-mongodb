
import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
    registerUserController,
    loginUserController,
    refreshUserSessionController,
    logoutUserController
}from '../controllers/auth.controllers.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserSchema, loginUserSchema} from '../validation/auth.validation.shema.js';
import express from 'express';

const jsonParser = express.json();
const router = Router();

router.post('/register', jsonParser, validateBody(registerUserSchema), ctrlWrapper(registerUserController),);
router.post('/login', jsonParser, validateBody(loginUserSchema), ctrlWrapper(loginUserController),);
router.post('/logout', ctrlWrapper(logoutUserController));
router.post('/refresh', ctrlWrapper(refreshUserSessionController));

export default router;
