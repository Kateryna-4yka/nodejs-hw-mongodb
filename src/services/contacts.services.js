import { contactsCollection } from '../db/models/contact.js';
// ===================================GET all
export const getAllContacts = async () => {
  return await contactsCollection.find();
};
// ===================================GET name
export const getContactByName = async (ContactName) => {
  return await contactsCollection.findOne({name: { $regex: ContactName, $options: "i" }});
};
// ===================================GET phone
export const getContactByPhone = async (phoneNumber) => {
  return await contactsCollection.findOne({ phoneNumber: phoneNumber });
};
// ===================================GET email
export const getContactByEmail = async (email) => {
  return await contactsCollection.findOne({ email: email });
};
// ===================================GET id
export const getContactById = async (contactId) => {
  return await contactsCollection.findById(contactId);
};
// ===================================POST
export const postContact = async (payload) => {
  return await contactsCollection.create(payload);
};
// ===================================DELETE id
export const deleteContactById = async (contactId) => {
  return await contactsCollection.findOneAndDelete({_id: contactId});
};
// ===================================DELETE name
export const deleteContactByName = async (ContactName) => {
  return await contactsCollection.findOneAndDelete({name: { $regex: ContactName, $options: "i" }});
};
// ===================================PUT
export const putContactById = async (contactId, payload, options = {}) => {
const putContact = await contactsCollection.findOneAndUpdate({ _id:contactId}, payload,{new: true, upsert: true,  includeResultMetadata: true, ...options},);

  return {value: putContact.value,
    updatedExisting: putContact.lastErrorObject.updatedExisting,
  };
};
// ===================================PATCH
export const patchContactById = async (contactId, payload) => {
  return await contactsCollection.findOneAndUpdate({ _id:contactId}, payload, {new: true});
};
