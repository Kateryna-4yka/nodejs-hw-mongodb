import { contactsCollection } from '../db/models/contact.js';

export const getAllContacts = async () => {
  const contacts = await contactsCollection.find();
  return contacts;
};

export const getContactsById = async (Id) => {
  const contactsById = await contactsCollection.findById(Id);
  return contactsById;
};
