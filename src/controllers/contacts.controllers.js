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
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { getPhotoUrl } from '../utils/getPhotoUrl.js';
// ===================================GET all
export const getAllContactsController = async (req, res) => {

    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams (req.query);
    const userId = req.user._id;

    const contacts = await getAllContacts({ page, perPage, sortBy, sortOrder, filter, userId});

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
    const userId = req.user._id;
    const contact = await getContactById(contactId, userId);

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
    const userId = req.user._id;
    const contactForDelete = await deleteContactById(contactId, userId);

    if (contactForDelete===null) {
        throw createHttpError(404, `Contact with id:${contactId} not found`);
    }
    res.status(204).send();
};
// ===================================POST
export const postContactController = async (req, res) => {
    const userId = req.user._id;
  const photoUrl = await getPhotoUrl(req.file);

    const newContact = await postContact({...req.body, userId, photo: photoUrl});

    res.status(201).json({
        status: 201,
        message: `Successfully created a new contact!`,
        data: newContact,
    });
};
// ===================================PUT id
export const putContactByIdController = async (req, res) => {
    const contactId = req.params.id;
    const userId = req.user._id;
    const photoUrl = await getPhotoUrl(req.file);
    const updatedData = { ...req.body };
    if (photoUrl) updatedData.photo = photoUrl;

    const putContact = await putContactById(contactId, userId, updatedData);

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
    const userId = req.user._id;
    const photoUrl = await getPhotoUrl(req.file);

    const updatedData = { ...req.body };
    if (photoUrl) updatedData.photo = photoUrl;
// в photo лежить обʼєкт файлу
	// {
	// 	  fieldname: 'photo',
	// 	  originalname: 'download.jpeg',
	// 	  encoding: '7bit',
	// 	  mimetype: 'image/jpeg',
	// 	  destination: '/Users/borysmeshkov/Projects/goit-study/students-app/temp',
	// 	  filename: '1710709919677_download.jpeg',
	// 	  path: '/Users/borysmeshkov/Projects/goit-study/students-app/temp/1710709919677_download.jpeg',
	// 	  size: 7
	// }
console.log('req.file:', req.file);
    const updateContact = await patchContactById(contactId, userId, updatedData);

    if (updateContact===null) {
        throw createHttpError(404, `Contact with id:${contactId} not found`);
    }

    res.json({
        status: 200,
        message:`Successfully updated ${updateContact.name} contact!`,
        data: updateContact});
};
