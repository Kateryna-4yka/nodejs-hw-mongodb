import { contactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';
// ===================================GET all
export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = 'name',
  filter,
  userId

}) => {
  const limit = perPage;
  const skip = page>0 ? (page - 1) * perPage : 0;

  const contactQuery = contactsCollection.find({userId});

  if (typeof filter.contactType !== 'undefined') {
    contactQuery.where("contactType").eq(filter.contactType);
  };
  if (typeof filter.isFavourite !== 'undefined') {
    contactQuery.where("isFavourite").eq(filter.isFavourite);
  };

  const contactCount = await contactQuery.clone().countDocuments();

  const contactsSortPagin = await contactQuery.skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).exec();

  const paginationData = calculatePaginationData(contactCount, perPage, page);

  return {
    data: contactsSortPagin,
    ...paginationData,
  };
};
// ===================================GET id
export const getContactById = async (contactId, userId) => {
  return await contactsCollection.findOne({_id: contactId, userId: userId});
};
// ===================================POST
export const postContact = async (payload) => {
  return await contactsCollection.create(payload);
};
// ===================================DELETE id
export const deleteContactById = async (contactId, userId) => {
  return await contactsCollection.findOneAndDelete({_id: contactId, userId: userId});
};

// ===================================PUT id
export const putContactById = async (contactId, userId , payload, options = {}) => {
const putContact = await contactsCollection.findOneAndUpdate({_id: contactId, userId: userId}, payload,{new: true, upsert: true,  includeResultMetadata: true, ...options},);
  return {value: putContact.value,
    updatedExisting: putContact.lastErrorObject.updatedExisting,
  };
};
// ===================================PATCH id
export const patchContactById = async (contactId, userId, payload) => {
  return await contactsCollection.findOneAndUpdate({_id: contactId, userId: userId}, payload, {new: true});
};
