import { Router } from "express";
import {ctrlWrapper} from '../utils/ctrlWrapper.js';
import {
    getContactByIdController,
    getContactByNameController,
    getContactByPhoneController,
    getAllContactsController,
    getContactByEmailController,
    postContactController,
    deleteContactByIdController,
    deleteContactByNameController,
    putContactByIdController,
    patchContactByIdController

} from "../controllers/contacts.controllers.js";
import express from 'express';

const jsonParser = express.json();
const router = Router();

// ===================================GET all
router.get ("/contacts", ctrlWrapper(getAllContactsController));
// ===================================GET name
router.get("/contacts/name/search", ctrlWrapper(getContactByNameController));
// ===================================GET phone
router.get("/contacts/phone/search", ctrlWrapper(getContactByPhoneController));
// ===================================GET email
router.get("/contacts/email/search", ctrlWrapper(getContactByEmailController));
// ===================================GET id
router.get ("/contacts/:id", ctrlWrapper(getContactByIdController));
// ===================================POST
router.post ("/contacts", jsonParser, ctrlWrapper(postContactController));
// ===================================DELETE id
router.delete ("/contacts/:id", ctrlWrapper(deleteContactByIdController));
// ===================================DELETE name
router.delete ("/contacts/name/search", ctrlWrapper(deleteContactByNameController));
// ===================================PUT
router.put ("/contacts/:id", jsonParser, ctrlWrapper(putContactByIdController));
// ===================================PATCH
router.patch ("/contacts/:id", jsonParser, ctrlWrapper(patchContactByIdController));
export default router;

// /contacts/name/search?name=Oleh
// /contacts/phone/search?phone=380000000009
// /contacts/email/search?email=andriy7@example.com

// {
//         "_id": "6821d8cb6aa9f218eae1cae5",
//         "name": "Anna Loft",
//         "phoneNumber": "+380000000044",
//         "email": "anna@example.com",
//         "isFavourite": false,
//         "contactType": "personal"
//     }
