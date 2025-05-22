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

const jsonParser = express.json();
const router = Router();

// ===================================GET all
router.get ("/contacts", ctrlWrapper(getAllContactsController));
// ===================================GET id
router.get ("/contacts/:id", isValidId, ctrlWrapper(getContactByIdController));
// ===================================POST
router.post ("/contacts", jsonParser, validateBody(createContactsSchema), ctrlWrapper(postContactController));
// ===================================DELETE id
router.delete ("/contacts/:id", isValidId, ctrlWrapper(deleteContactByIdController));
// ===================================PUT id
router.put ("/contacts/:id", jsonParser, isValidId, validateBody(createContactsSchema), ctrlWrapper(putContactByIdController));
// ===================================PATCH id
router.patch ("/contacts/:id", jsonParser, isValidId, validateBody(updateContactsSchema), ctrlWrapper(patchContactByIdController));
export default router;

