import {
    getAllContacts,
    getContactById,
    getContactByName,
    getContactByPhone,
    getContactByEmail,
    postContact,
    deleteContactById,
    deleteContactByName,
    putContactById,
    patchContactById
 } from '../services/contacts.services.js';
import createHttpError from 'http-errors';

// ===================================GET all
export const getAllContactsController = async (req, res) => {
    const contacts = await getAllContacts();

    if (contacts===null) {
        throw createHttpError(404, `Contacts not found`);
    }

    if (contacts.length == 0) {
        throw createHttpError(404, 'There are no contacts in the notebook yet!');
    }

    res.json({
        status: 200,
      message: "Successfully found contacts!",
        data: contacts,
    });
};
// ===================================GET name
export const getContactByNameController = async (req, res) => {
    const name = req.query.name;
    const contact = await getContactByName(name);

    if (contact===null) {
        throw createHttpError(404, `${name} not found`);
    }

    res.json({
        status: 200,
        message: `We found contact ${name}!`,
        data: contact,
    });
};
// ===================================GET phone
export const getContactByPhoneController = async (req, res) => {
    const phone = req.query.phone?.trim().replace(/\s/g, '').replace(/^(\+)?/, '+');
    const contact = await getContactByPhone(phone);

    if (contact===null) {
        throw createHttpError(404, `Contact with phone number :${phone} not found`);
    }

    res.json({
        status: 200,
        message: `We found contact with phone:${phone}!`,
        data: contact,
    });
};
// ===================================GET email
export const getContactByEmailController = async (req, res) => {
    const email = req.query.email;
    const contact = await getContactByEmail(email);

    if (contact===null) {
        throw createHttpError(404, `Contact with email :${email} not found`);
    }

    res.json({
        status: 200,
        message: `We found contact with email:${email}!`,
        data: contact,
    });
};
// ===================================GET id
export const getContactByIdController = async (req, res) => {
    const contactId = req.params.id;
    const contact = await getContactById(contactId);

    if (contact===null) {
        throw createHttpError(404, `Contact with id:${contactId} not found`);
    }

    res.json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    });
};
// ===================================POST
export const postContactController = async (req, res) => {
    const { name, phoneNumber, contactType } = req.body;

    // Перевірка обов'язкових полів які передає користувач у тіло запиту
    if (!name || !phoneNumber || !contactType) {
      throw createHttpError(400, "Missing required fields: name, phoneNumber, contactType");
    }
    const newContact = await postContact(req.body);

    res.json({
        status: 201,
        message: `Successfully created a new contact!`,
        data: newContact,
    });
};
// ===================================DELETE id
export const deleteContactByIdController = async (req, res) => {
    const contactId = req.params.id;
    const contactForDelete = await deleteContactById(contactId);

    if (contactForDelete===null) {
        throw createHttpError(404, `Contact with id:${contactId} not found`);
    }
    res.status(204).send();
};
// ===================================DELETE name
export const deleteContactByNameController = async (req, res) => {
    const name = req.query.name;
    const contactForDelete = await deleteContactByName(name);

    if (contactForDelete===null) {
        throw createHttpError(404, `${name} not found`);
    }
    res.json({
        status: 204,
        message: `${contactForDelete.name} deleted!`,
    });
};
// ===================================PUT id
export const putContactByIdController = async (req, res) => {
    const contactId = req.params.id;
    const putContact = await putContactById(contactId, req.body);

    if (putContact===null) {
        throw createHttpError(404, `Contact with id:${contactId} not found`);
    }

    if (putContact.updatedExisting===true)
        {return res.status(200).json({
            status: 200,
            message: `Successfully updated contact!`,
            data: putContact.value,
    });}

    res.json({
        status: 201,
        message: `Successfully created a new contact ${putContact.value.name}!`,
        data: putContact.value,
    });
};
// ===================================PATCH id
export const patchContactByIdController = async (req, res, next) => {
    const contactId = req.params.id;
    const updateContact = await patchContactById(contactId, req.body);

    if (updateContact===null) {
        throw createHttpError(404, `Contact with id:${contactId} not found`);
    }
    res.json({
        status: 200,
        message:`Successfully updated ${updateContact.name} contact!`,
        data: updateContact});
};
