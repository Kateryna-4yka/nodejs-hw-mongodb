import {
    getAllContacts,
    getContactById,
    postContact,
    deleteContactById,
    putContactById,
    patchContactById
 } from '../services/contacts.services.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
// ===================================GET all
export const getAllContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams (req.query);

    const contacts = await getAllContacts({ page, perPage, sortBy, sortOrder, filter });

    if (contacts===null) {
        throw createHttpError(404, `Contacts not found`);
    }

    if (contacts.data.length === 0) {
        throw createHttpError(404, 'There are no contacts in the notebook yet!');
    }

    res.json({
    status: 200,
    message: "Successfully found contacts!",
    data: {
        data: contacts.data,
        page: contacts.page,
        perPage: contacts.perPage,
        totalItems: contacts.totalItems,
        totalPages: contacts.totalPages,
        hasPreviousPage: contacts.hasPreviousPage,
        hasNextPage: contacts.hasNextPage,
    }
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
// ===================================DELETE id
export const deleteContactByIdController = async (req, res) => {
    const contactId = req.params.id;
    const contactForDelete = await deleteContactById(contactId);

    if (contactForDelete===null) {
        throw createHttpError(404, `Contact with id:${contactId} not found`);
    }
    res.status(204).send();
};
// ===================================POST
export const postContactController = async (req, res) => {

    const newContact = await postContact(req.body);

    res.status(201).json({
        status: 201,
        message: `Successfully created a new contact!`,
        data: newContact,
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
