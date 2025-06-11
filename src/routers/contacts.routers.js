import { Router } from "express";
import {ctrlWrapper} from '../utils/ctrlWrapper.js';
import {
    getContactByIdController,
    getAllContactsController,
    postContactController,
    deleteContactByIdController,
    putContactByIdController,
    patchContactByIdController

} from "../controllers/contacts.controllers.js";
import express from 'express';
import { validateBody } from "../middlewares/validateBody.js";
import { createContactsSchema, updateContactsSchema } from "../validation/contacts.validation.shema.js";
import { isValidId } from "../middlewares/isValidId.js";
import { upload } from '../middlewares/multer.js';


const jsonParser = express.json();
const router = Router();

// ===================================GET all
router.get ("/", ctrlWrapper(getAllContactsController));
// ===================================GET id
router.get ("/:id", isValidId, ctrlWrapper(getContactByIdController));
// ===================================POST
router.post ("/", jsonParser, upload.single('photo'), validateBody(createContactsSchema), ctrlWrapper(postContactController));
// ===================================DELETE id
router.delete ("/:id", isValidId, ctrlWrapper(deleteContactByIdController));
// ===================================PUT id
router.put ("/:id", jsonParser, isValidId, upload.single('photo'), validateBody(createContactsSchema), ctrlWrapper(putContactByIdController));
// ===================================PATCH id
router.patch ("/:id", jsonParser, isValidId, upload.single('photo'), validateBody(updateContactsSchema), ctrlWrapper(patchContactByIdController));
// якщо хочемо зберігати одразу багато фоток від користувача, тоді пише upload.array('photo', 10), тут 10 це ліміт фоток на  завантаження

export default router;
